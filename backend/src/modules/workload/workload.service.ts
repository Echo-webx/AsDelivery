import { BadRequestException, Injectable } from '@nestjs/common'
import { EnumUserRole, Prisma, User } from '@prisma/client'
import { Search } from 'src/common/dto/main.dto'
import {
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { UserGetByService } from 'src/modules/user/user-getBy.service'
import { WorkloadItemDto, WorkloadUpsertDto } from './dto/workload.dto'

@Injectable()
export class WorkloadService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userGetBy: UserGetByService
	) {}

	async getForUser(id: string, query: Search, currentUser: User) {
		const user = await this.userGetBy.idAndRoleOrRegionsId(
			id,
			EnumUserRole.default,
			{
				...(currentUser.checkRegion &&
					currentUser.role !== EnumUserRole.root && {
						linkRegions: { some: { regionId: currentUser.activeRegionId } }
					})
			}
		)
		if (!user) throw new Error('User not found')

		const skip = (query.page - 1) * query.limit
		const whereProduct: Prisma.ProductWhereInput = {
			linkRegions: {
				some: {
					regionId: {
						in: user.linkRegions.map(r => r.regionId)
					},
					...(currentUser.checkRegion &&
						currentUser.role !== EnumUserRole.root && {
							AND: { regionId: currentUser.activeRegionId }
						})
				}
			}
		}
		const whereCategory: Prisma.ProductCategoryWhereInput = {
			linkProducts: {
				some: {
					product: {
						linkRegions: {
							some: {
								regionId: {
									in: user.linkRegions.map(r => r.regionId)
								},
								...(currentUser.checkRegion &&
									currentUser.role !== EnumUserRole.root && {
										AND: { regionId: currentUser.activeRegionId }
									})
							}
						}
					}
				}
			}
		}
		if (query.search) {
			whereProduct.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const categories = await this.prisma.productCategory.findMany({
			where: whereCategory,
			skip,
			take: query.limit,
			include: {
				linkUsers: { where: { userId: user.id } }
			},
			orderBy: { name: 'asc' }
		})

		const remainingLimit = query.limit - categories.length

		let products = []

		if (remainingLimit > 0) {
			const productSkip = Math.max(
				0,
				skip -
					(await this.prisma.productCategory.count({ where: whereCategory }))
			)
			products = await this.prisma.product.findMany({
				where: whereProduct,
				skip: productSkip,
				take: remainingLimit,
				include: {
					linkUsers: { where: { userId: user.id } }
				},
				orderBy: { name: 'asc' }
			})
		}
		const [totalCategoriesCount, totalProductsCount] = await Promise.all([
			this.prisma.productCategory.count({ where: whereCategory }),
			this.prisma.product.count({ where: whereProduct })
		])
		const totalCount = totalCategoriesCount + totalProductsCount

		return { items: [...categories, ...products], totalCount }
	}

	async getAll(query: Search, user: User) {
		const skip = (query.page - 1) * query.limit
		const whereProduct: Prisma.ProductWhereInput = {
			linkUsers: { some: { userId: user.id } },
			linkRegions: { some: { regionId: user.activeRegionId } }
		}
		const whereCategory: Prisma.ProductCategoryWhereInput = {
			linkUsers: { some: { userId: user.id } },
			linkProducts: {
				some: {
					product: {
						linkRegions: { some: { regionId: user.activeRegionId } }
					}
				}
			}
		}
		if (query.search) {
			whereProduct.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const categories = await this.prisma.productCategory.findMany({
			where: whereCategory,
			skip,
			take: query.limit,
			include: {
				linkUsers: { where: { userId: user.id } },
				linkProducts: {
					where: {
						product: {
							linkRegions: { some: { regionId: user.activeRegionId } }
						}
					},
					include: { product: true }
				}
			}
		})

		const productsFromCategories = categories.flatMap(c =>
			c.linkProducts.map(p => p.product)
		)

		const remainingLimit = query.limit - productsFromCategories.length

		let products = []

		if (remainingLimit > 0) {
			const productSkip = Math.max(
				0,
				skip -
					(await this.prisma.productCategory.count({ where: whereCategory }))
			)
			products = await this.prisma.product.findMany({
				where: whereProduct,
				skip: productSkip,
				take: remainingLimit,
				include: {
					linkUsers: {
						where: {
							userId: user.id
						}
					}
				}
			})
		}
		const [totalCategoriesCount, totalProductsCount] = await Promise.all([
			this.prisma.productCategory.count({ where: whereCategory }),
			this.prisma.product.count({ where: whereProduct })
		])
		const totalCount = totalCategoriesCount + totalProductsCount

		return { items: [...categories, ...products], totalCount }
	}

	async getUser(id: string, currentUser: User) {
		const user = await this.userGetBy.idAndRole(id, EnumUserRole.default, {
			...(currentUser.checkRegion &&
				currentUser.role !== EnumUserRole.root && {
					linkRegions: { some: { regionId: currentUser.activeRegionId } }
				})
		})
		if (!user) throw new BadRequestException('User not found')

		const whereProduct: Prisma.ProductWhereInput = {
			linkUsers: { some: { userId: user.id } },
			...(currentUser.checkRegion &&
				currentUser.role !== EnumUserRole.root && {
					linkRegions: {
						some: { regionId: currentUser.activeRegionId }
					}
				})
		}
		const whereCategory: Prisma.ProductCategoryWhereInput = {
			linkUsers: { some: { userId: user.id } },
			...(currentUser.checkRegion &&
				currentUser.role !== EnumUserRole.root && {
					linkProducts: {
						some: {
							product: {
								linkRegions: {
									some: { regionId: currentUser.activeRegionId }
								}
							}
						}
					}
				})
		}

		const categories = await this.prisma.productCategory.findMany({
			where: whereCategory,
			include: {
				linkUsers: { where: { userId: user.id } }
			}
		})

		const products = await this.prisma.product.findMany({
			where: whereProduct,
			include: {
				linkUsers: { where: { userId: user.id } }
			}
		})

		return [...categories, ...products]
	}

	async upsert(dto: WorkloadUpsertDto, currentUser: User) {
		const user = await this.userGetBy.idAndRoleOrRegionsIdAndLinkItem(
			dto.userId,
			EnumUserRole.default,
			{
				...(currentUser.checkRegion &&
					currentUser.role !== EnumUserRole.root && {
						linkRegions: { some: { regionId: currentUser.activeRegionId } }
					})
			}
		)
		if (!user) throw new BadRequestException('User not found')

		if (
			currentUser.role !== EnumUserRole.root &&
			!user.linkRegions.some(r => r.regionId === currentUser.activeRegionId)
		)
			throw new BadRequestException(
				'regional responsibility does not correspond to'
			)

		const idCountMap = new Map()
		for (const item of dto.items) {
			if (idCountMap.has(item.id))
				throw new BadRequestException(`Duplicate linkId found: ${item.id}`)
			idCountMap.set(item.id, item)
		}

		const exsProductIds = user.linkProducts.map(link => link.id)
		const exsCategoryIds = user.linkProductCategories.map(link => link.id)

		const products = dto.items.filter(item => item.group === 'product')
		const categories = dto.items.filter(item => item.group === 'category')

		const totalCount = dto.items.reduce((total, item) => total + item.count, 0)

		const productsToCreate = this.getItemsToCreate(products, exsProductIds)
		const productsToUpdate = this.getItemsToUpdate(products, user.linkProducts)
		const productsToDelete = this.getItemsToDelete(exsProductIds, products)

		const categoriesToCreate = this.getItemsToCreate(categories, exsCategoryIds)
		const categoriesToUpdate = this.getItemsToUpdate(
			categories,
			user.linkProductCategories
		)
		const categoriesToDelete = this.getItemsToDelete(exsCategoryIds, categories)

		try {
			await this.prisma.$transaction(async prisma => {
				if (totalCount !== user.count)
					await prisma.user.update({
						where: { id: user.id },
						data: { count: totalCount }
					})
				if (productsToDelete.length > 0)
					await prisma.productToUser.deleteMany({
						where: { id: { in: productsToDelete } }
					})
				if (categoriesToDelete.length > 0)
					await prisma.productCategoryToUser.deleteMany({
						where: { id: { in: categoriesToDelete } }
					})
				if (productsToCreate.length > 0)
					await prisma.productToUser.createMany({
						data: productsToCreate.map(item => ({
							userId: dto.userId,
							productId: item.id,
							count: item.count
						}))
					})
				if (categoriesToCreate.length > 0)
					await prisma.productCategoryToUser.createMany({
						data: categoriesToCreate.map(item => ({
							userId: dto.userId,
							productCategoryId: item.id,
							count: item.count
						}))
					})
				if (productsToUpdate.length > 0)
					await Promise.all(
						productsToUpdate.map(item =>
							prisma.productToUser.update({
								where: { id: item.linkId },
								data: { count: item.count }
							})
						)
					)
				if (categoriesToUpdate.length > 0)
					await Promise.all(
						categoriesToUpdate.map(item =>
							prisma.productCategoryToUser.update({
								where: { id: item.linkId },
								data: { count: item.count }
							})
						)
					)
			})
		} catch (err) {
			handlePrismaError(err, 'Workload upsert error', {})
		}
	}

	private getItemsToCreate(items: WorkloadItemDto[], exsIds: string[]) {
		return items.filter(item => !exsIds.includes(item.linkId))
	}
	private getItemsToUpdate(
		items: WorkloadItemDto[],
		exsLinks: { id: string; count: number }[]
	) {
		return items.filter(item => {
			const exs = exsLinks.find(link => link.id === item.linkId)
			return exs && exs.count !== item.count
		})
	}
	private getItemsToDelete(exsIds: string[], items: WorkloadItemDto[]) {
		return exsIds.filter(linkId => !items.some(item => item.linkId === linkId))
	}
}
