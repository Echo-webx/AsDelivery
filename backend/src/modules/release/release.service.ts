import { BadRequestException, Injectable } from '@nestjs/common'
import {
	EnumProductReleaseMarking,
	EnumProductReleaseStatus,
	EnumProductVisible,
	EnumUserRole,
	Prisma,
	User
} from '@prisma/client'
import {
	differenceInHours,
	endOfDay,
	endOfYear,
	getYear,
	startOfDay,
	startOfYear
} from 'date-fns'
import { SearchOrIndex } from 'src/common/dto/main.dto'
import { generateTag } from 'src/common/utils/tag-generator.util'
import {
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { ReleaseCreateDto, ReleaseUpdateDto } from './dto/release.dto'

@Injectable()
export class ReleaseService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(query: SearchOrIndex, user: User) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.ProductReleaseWhereInput = {
			...(user.checkRegion &&
				user.role !== EnumUserRole.root && {
					regionId: user.activeRegionId
				}),
			...(user.role === EnumUserRole.default
				? { userId: user.id }
				: query.index !== 'all' && {
						userId: query.index
					}),
			...(user.role !== EnumUserRole.root && {
				marking: { not: EnumProductReleaseMarking.deleted }
			})
		}
		if (query.search) {
			whereConditions.OR = [
				{ tag: { contains: query.search, mode: 'insensitive' } },
				{ addressName: { contains: query.search, mode: 'insensitive' } }
			]
		} else {
			whereConditions.OR = [
				{
					createdAt: {
						gte: startOfDay(query.date),
						lte: endOfDay(query.dateTo || query.date)
					}
				}
			]
		}

		const errorReleases = await this.prisma.productRelease.findMany({
			where: {
				...whereConditions,
				status: EnumProductReleaseStatus.error,
				AND: { marking: EnumProductReleaseMarking.null }
			},
			select: { id: true, tag: true },
			orderBy: { createdAt: 'desc' }
		})
		const editReleases = await this.prisma.productRelease.findMany({
			where: {
				...whereConditions,
				status: EnumProductReleaseStatus.edit,
				AND: { marking: EnumProductReleaseMarking.null }
			},
			select: { id: true, tag: true },
			orderBy: { createdAt: 'desc' }
		})
		const [release, totalCount] = await Promise.all([
			this.prisma.productRelease.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				orderBy: { createdAt: 'desc' }
			}),
			this.prisma.productRelease.count({
				where: whereConditions
			})
		])

		const statistics = await this.prisma.productRelease
			.aggregate({
				where: {
					...whereConditions,
					marking: { not: EnumProductReleaseMarking.deleted }
				},
				_sum: {
					totalAmount: true,
					totalSale: true,
					totalSwap: true,
					totalBonus: true
				}
			})
			.then(r => r._sum)

		return {
			release,
			errorReleases,
			editReleases,
			totalCount,
			statistics
		}
	}

	async getOne(id: string, user: User) {
		const one = await this.prisma.productRelease.findUnique({
			where: {
				id,
				...(user.role === EnumUserRole.default && {
					userId: user.id
				}),
				...(user.checkRegion &&
					user.role !== EnumUserRole.root && {
						regionId: user.activeRegionId
					}),
				...(user.role !== EnumUserRole.root && {
					marking: { not: EnumProductReleaseMarking.deleted }
				})
			},
			include: {
				position: { orderBy: { name: 'asc' } }
			}
		})
		if (!one) throw new BadRequestException('Release not found')
		return one
	}

	private async releaseTag(): Promise<string> {
		const date = new Date()
		const countLogs = await this.prisma.productRelease.count({
			where: { createdAt: { gte: startOfYear(date), lt: endOfYear(date) } }
		})
		return await generateTag('DEL', countLogs, getYear(date))
	}
	private checkNegativeLimit = (newCount: number) => {
		if (newCount < -100)
			throw new BadRequestException('The negative limit has been exceeded')
		if (newCount < 0) return EnumProductReleaseStatus.error
	}

	async create(user: User, dto: ReleaseCreateDto) {
		const address = await this.prisma.address.findUnique({
			where: {
				id: dto.addressId,
				linkRegions: { some: { regionId: user.activeRegionId } }
			}
		})
		if (!address) throw new BadRequestException('Address not found')

		const region = await this.prisma.region.findUnique({
			where: { id: user.activeRegionId }
		})
		if (!region) throw new BadRequestException('Region not found')

		const dtoIds = dto.items.map(p => p.id)
		const dtoProducts = dto.items.filter(p => p.group === 'product')
		const dtoCategories = dto.items.filter(p => p.group === 'category')

		const products = await this.prisma.product.findMany({
			where: {
				id: { in: dtoIds },
				visible: { not: EnumProductVisible.reception }
			}
		})
		const linkProducts = await this.prisma.productToUser.findMany({
			where: { id: { in: dtoProducts.map(p => p.linkId) } }
		})
		const linkProductCategories =
			await this.prisma.productCategoryToUser.findMany({
				where: { id: { in: dtoCategories.map(p => p.linkId) } }
			})

		const productMap = new Map(products.map(p => [p.id, p]))
		const linkProductsMap = new Map(linkProducts.map(lp => [lp.id, lp]))
		const linkCategoriesMap = new Map(
			linkProductCategories.map(lpc => [lpc.id, lpc])
		)

		dto.items.forEach(dtoItem => {
			const product = productMap.get(dtoItem.id)
			const link =
				dtoItem.group === 'product'
					? linkProductsMap.get(dtoItem.linkId)
					: linkCategoriesMap.get(dtoItem.linkId)
			if (!product) throw new BadRequestException(`Product not found`)
			if (!link) throw new BadRequestException(`Link not found`)
		})

		let status: EnumProductReleaseStatus = 'warning'

		const totalQuantity = dto.items.reduce(
			(total, item) =>
				total + item.quantitySale + item.quantitySwap + item.quantityBonus,
			0
		)
		const totalCount = user.count - totalQuantity
		if (totalCount === 0) status = 'confirm'
		status = this.checkNegativeLimit(totalCount) || status

		const total = dto.items.reduce(
			(totals, dtoProduct) => {
				const product = productMap.get(dtoProduct.id)
				if (dtoProduct.quantitySale > 0)
					totals.amount += dtoProduct.quantitySale * product.salePrice
				totals.sale += dtoProduct.quantitySale || 0
				totals.swap += dtoProduct.quantitySwap || 0
				totals.bonus += dtoProduct.quantityBonus || 0
				return totals
			},
			{ amount: 0, sale: 0, swap: 0, bonus: 0 }
		)

		const positionsData: Prisma.ProductReleasePositionCreateManyInput[] = []
		const updateLinkData = new Map<string, number>()

		dtoCategories.forEach(dtoItem => {
			const link = linkCategoriesMap.get(dtoItem.linkId)
			const newCount =
				(updateLinkData.get(link.id) || link.count) -
				(dtoItem.quantitySale + dtoItem.quantitySwap + dtoItem.quantityBonus)
			updateLinkData.set(link.id, newCount)
		})

		dto.items.forEach(dtoItem => {
			const product = productMap.get(dtoItem.id)
			const link =
				dtoItem.group === 'product'
					? linkProductsMap.get(dtoItem.linkId)
					: linkCategoriesMap.get(dtoItem.linkId)

			const newCount =
				dtoItem.group === 'product'
					? link.count -
						(dtoItem.quantitySale +
							dtoItem.quantitySwap +
							dtoItem.quantityBonus)
					: updateLinkData.get(link.id)
			status = this.checkNegativeLimit(newCount) || status

			positionsData.push({
				productId: product.id,
				archiveProductId: product.id,
				name: product.name,
				salePrice: product.salePrice,
				purchasePrice: product.purchasePrice,
				count: newCount,
				...(newCount < 0 && { countError: newCount }),
				amount: dtoItem.quantitySale * product.salePrice,
				quantitySale: dtoItem.quantitySale,
				quantitySwap: dtoItem.quantitySwap,
				quantityBonus: dtoItem.quantityBonus
			})

			if (dtoItem.group === 'product') updateLinkData.set(link.id, newCount)
		})

		const updateProductsData = linkProducts.map(link => ({
			linkId: link.id,
			count: updateLinkData.get(link.id)
		}))

		const updateCategoriesData = linkProductCategories.map(link => ({
			linkId: link.id,
			count: updateLinkData.get(link.id)
		}))

		const productsToUpdate = updateProductsData.filter(p => p.count !== 0)
		const productsToDelete = updateProductsData
			.filter(p => p.count === 0)
			.map(p => p.linkId)

		const categoriesToUpdate = updateCategoriesData.filter(c => c.count !== 0)
		const categoriesToDelete = updateCategoriesData
			.filter(c => c.count === 0)
			.map(c => c.linkId)

		const tag = await this.releaseTag()

		try {
			await this.prisma.$transaction(async prisma => {
				const upUser = await prisma.user.update({
					where: { id: user.id },
					data: { count: totalCount },
					include: { info: true }
				})
				await prisma.productRelease.create({
					data: {
						userId: user.id,
						archiveUserId: user.id,
						regionId: region.id,
						archiveRegionId: region.id,
						addressId: address.id,
						archiveAddressId: address.id,
						status,
						tag,
						totalAmount: total.amount,
						totalSale: total.sale,
						totalSwap: total.swap,
						totalBonus: total.bonus,
						totalCount,
						...(totalCount < 0 && {
							totalCountError: totalCount
						}),
						userFIO: `${upUser.info.name} ${upUser.info.surname} ${upUser.info.patronymic}`,
						addressName: address.name,
						addressPosition: address.position,
						regionName: region.name,
						position: {
							createMany: { data: positionsData }
						}
					}
				})

				if (productsToDelete.length > 0)
					await prisma.productToUser.deleteMany({
						where: { id: { in: productsToDelete } }
					})
				if (categoriesToDelete.length > 0)
					await prisma.productCategoryToUser.deleteMany({
						where: { id: { in: categoriesToDelete } }
					})
				if (productsToUpdate.length > 0)
					await Promise.all(
						productsToUpdate.map(item =>
							prisma.productToUser.updateMany({
								where: { id: item.linkId },
								data: { count: item.count }
							})
						)
					)
				if (categoriesToUpdate.length > 0)
					await Promise.all(
						categoriesToUpdate.map(item =>
							prisma.productCategoryToUser.updateMany({
								where: { id: item.linkId },
								data: { count: item.count }
							})
						)
					)
			})
		} catch (err) {
			handlePrismaError(err, 'Error create Release', {})
		}
	}

	async update(id: string, dto: ReleaseUpdateDto, user: User) {
		const productRelease = await this.prisma.productRelease.findUnique({
			where: {
				id,
				...(user.checkRegion &&
					user.role !== EnumUserRole.root && {
						regionId: user.activeRegionId
					})
			},
			include: { position: true }
		})
		if (!productRelease)
			throw new BadRequestException('Product Release not found')

		if (productRelease.marking !== EnumProductReleaseMarking.null)
			throw new BadRequestException('Product Release not valid')

		if (
			user.role !== EnumUserRole.root &&
			differenceInHours(new Date(), productRelease.createdAt) > 24
		)
			throw new BadRequestException(
				'Update is allowed only within 1 day of creation'
			)

		const positionMap = new Map(productRelease.position.map(p => [p.id, p]))

		dto.position.forEach(upPos => {
			const position = positionMap.get(upPos.id)
			if (!position) throw new BadRequestException(`Position not found`)
		})

		let status: EnumProductReleaseStatus = productRelease.status
		let error = false

		const updatedPositions = dto.position
			.map(upPos => {
				const position = positionMap.get(upPos.id)

				const newTotalQuantity =
					upPos.quantitySale + upPos.quantitySwap + upPos.quantityBonus
				const oldTotalQuantity =
					position.quantitySale + position.quantitySwap + position.quantityBonus

				const countEdit = oldTotalQuantity - newTotalQuantity

				if (this.checkNegativeLimit(position.count + countEdit) === 'error') {
					error = true
					status = 'error'
				}

				if (
					countEdit === 0 &&
					position.quantitySale === upPos.quantitySale &&
					position.quantitySwap === upPos.quantitySwap &&
					position.quantityBonus === upPos.quantityBonus
				)
					return

				if (error === false) status = 'edit'

				return {
					id: position.id,
					amount: upPos.quantitySale * position.salePrice,
					quantitySale: upPos.quantitySale,
					quantitySwap: upPos.quantitySwap,
					quantityBonus: upPos.quantityBonus,
					count: position.count + countEdit,
					countEdit: countEdit,
					oldCountEdit: position.countEdit
				}
			})
			.filter(Boolean)

		const totalCountEdit = updatedPositions.reduce((total, pos) => {
			return total + (pos.countEdit !== 0 ? pos.countEdit : pos.oldCountEdit)
		}, 0)

		const totalCount = productRelease.totalCount + totalCountEdit
		status = this.checkNegativeLimit(totalCount) || status

		const total = dto.position.reduce(
			(totals, dtoPos) => {
				const position = positionMap.get(dtoPos.id)
				if (dtoPos.quantitySale > 0)
					totals.amount += dtoPos.quantitySale * position.salePrice
				totals.sale += dtoPos.quantitySale || 0
				totals.swap += dtoPos.quantitySwap || 0
				totals.bonus += dtoPos.quantityBonus || 0
				return totals
			},
			{ amount: 0, sale: 0, swap: 0, bonus: 0 }
		)

		try {
			await this.prisma.$transaction(async prisma => {
				await prisma.productRelease.update({
					where: { id },
					data: {
						status,
						totalCount,
						totalAmount: total.amount,
						totalSale: total.sale,
						totalSwap: total.swap,
						totalBonus: total.bonus,
						...(totalCountEdit !== 0 && {
							totalCountEdit
						})
					}
				})

				await Promise.all(
					updatedPositions.map(pos =>
						prisma.productReleasePosition.update({
							where: { id: pos.id },
							data: {
								amount: pos.amount,
								quantitySale: pos.quantitySale,
								quantitySwap: pos.quantitySwap,
								quantityBonus: pos.quantityBonus,
								count: pos.count,
								...(pos.countEdit !== 0 && {
									countEdit: pos.countEdit
								})
							}
						})
					)
				)
			})
		} catch (err) {
			handlePrismaError(err, 'Error update Release', {
				notFound: 'Release not found'
			})
		}
	}

	async marking(id: string, marking: EnumProductReleaseMarking) {
		try {
			await this.prisma.productRelease.update({
				where: { id },
				data: { marking }
			})
		} catch (err) {
			handlePrismaError(err, 'Error marking Release', {
				notFound: 'Release not found'
			})
		}
	}
}
