import { BadRequestException, Injectable } from '@nestjs/common'
import {
	EnumProductReceptionMarking,
	EnumProductReceptionStatus,
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
import { Search, SearchOrIndex } from 'src/common/dto/main.dto'
import { generateTag } from 'src/common/utils/tag-generator.util'
import {
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { ProductService } from '../product/product.service'
import { ReceptionCreateDto, ReceptionUpdateDto } from './dto/reception.dto'

@Injectable()
export class ReceptionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly productService: ProductService
	) {}

	async getAll(query: SearchOrIndex, user: User) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.ProductReceptionWhereInput = {
			...(user.role !== EnumUserRole.root && {
				userId: user.id,
				marking: { not: EnumProductReceptionMarking.deleted }
			})
		}
		if (query.search) {
			whereConditions.OR = [
				{ tag: { contains: query.search, mode: 'insensitive' } },
				{ vendor: { contains: query.search, mode: 'insensitive' } }
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
		const editReceptions = await this.prisma.productReception.findMany({
			where: {
				...whereConditions,
				status: EnumProductReceptionStatus.edit,
				AND: { marking: EnumProductReceptionMarking.null }
			},
			select: { id: true, tag: true },
			orderBy: { createdAt: 'desc' }
		})
		const [reception, totalCount] = await Promise.all([
			this.prisma.productReception.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				orderBy: { createdAt: 'desc' }
			}),
			this.prisma.productReception.count({
				where: whereConditions
			})
		])

		const statistics = await this.prisma.productReception
			.aggregate({
				where: {
					...whereConditions,
					marking: { not: EnumProductReceptionMarking.deleted }
				},
				_sum: {
					totalAmount: true
				}
			})
			.then(r => r._sum)

		return {
			reception,
			editReceptions,
			totalCount,
			statistics
		}
	}

	async getProduct(query: Search) {
		return await this.productService.getAll(query, {
			visible: { not: EnumProductVisible.reception }
		})
	}

	async getOne(id: string, user: User) {
		return await this.prisma.productReception.findUnique({
			where: {
				id,
				...(user.role !== EnumUserRole.root && {
					userId: user.id,
					marking: { not: EnumProductReceptionMarking.deleted }
				})
			},
			include: { position: { orderBy: { name: 'asc' } } }
		})
	}

	private async receptionTag(): Promise<string> {
		const date = new Date()
		const countLogs = await this.prisma.productReception.count({
			where: { createdAt: { gte: startOfYear(date), lt: endOfYear(date) } }
		})
		return await generateTag('GRN', countLogs, getYear(date))
	}
	async create(user: User, dto: ReceptionCreateDto) {
		const dtoIds = dto.items.map(p => p.id).filter(id => id !== undefined)

		const userInfo = await this.prisma.userInfo.findUnique({
			where: { userId: user.id }
		})
		if (!userInfo) throw new BadRequestException('User info not found')

		const products = await this.prisma.product.findMany({
			where: {
				id: { in: dtoIds },
				visible: { not: EnumProductVisible.release }
			}
		})
		const productMap = new Map(products.map(p => [p.id, p]))

		dtoIds.forEach(id => {
			const product = productMap.get(id)
			if (!product) throw new BadRequestException(`Product not found`)
		})

		const total = dto.items.reduce(
			(totals, dtoProduct) => {
				const product = productMap.get(dtoProduct.id)
				if (dtoProduct.quantity > 0)
					totals.amount += product
						? dtoProduct.quantity * product.purchasePrice
						: dtoProduct.quantity * dtoProduct.purchasePrice
				totals.quant += dtoProduct.quantity || 0
				return totals
			},
			{ amount: 0, quant: 0 }
		)

		const positionsData: Prisma.ProductReceptionPositionCreateManyInput[] = []

		dto.items.forEach(dtoItem => {
			const product = productMap.get(dtoItem.id)
			if (product) {
				positionsData.push({
					productId: product.id,
					archiveProductId: product.id,
					name: product.name,
					purchasePrice: product.purchasePrice,
					amount: dtoItem.quantity * product.purchasePrice,
					quantity: dtoItem.quantity
				})
			} else {
				positionsData.push({
					name: dtoItem.name,
					purchasePrice: dtoItem.purchasePrice,
					amount: dtoItem.quantity * dtoItem.purchasePrice,
					quantity: dtoItem.quantity
				})
			}
		})

		const tag = await this.receptionTag()

		try {
			await this.prisma.$transaction(async prisma => {
				await prisma.productReception.create({
					data: {
						userId: user.id,
						archiveUserId: user.id,
						status: EnumProductReceptionStatus.confirm,
						tag,
						totalAmount: total.amount,
						totalQuantity: total.quant,
						userFIO: `${userInfo.name} ${userInfo.surname} ${userInfo.patronymic}`,
						vendor: dto.vendor,
						position: {
							createMany: { data: positionsData }
						}
					}
				})
			})
		} catch (err) {
			handlePrismaError(err, 'Error create Reception', {})
		}
	}

	async update(id: string, dto: ReceptionUpdateDto, user: User) {
		const productReception = await this.prisma.productReception.findUnique({
			where: {
				id,
				...(user.role !== EnumUserRole.root && {
					userId: user.id
				})
			},
			include: { position: true }
		})
		if (!productReception)
			throw new BadRequestException('Product Reception not found')

		if (productReception.marking !== EnumProductReceptionMarking.null)
			throw new BadRequestException('Product Reception not valid')

		if (
			user.role !== EnumUserRole.root &&
			differenceInHours(new Date(), productReception.createdAt) > 24
		)
			throw new BadRequestException(
				'Update is allowed only within 1 day of creation'
			)

		const positionMap = new Map(productReception.position.map(p => [p.id, p]))

		dto.position.forEach(upPos => {
			const position = positionMap.get(upPos.id)
			if (!position) throw new BadRequestException(`Position not found`)
		})

		let status: EnumProductReceptionStatus = productReception.status

		const updatedPositions = dto.position
			.map(upPos => {
				const position = positionMap.get(upPos.id)
				const quantityEdit = position.quantity - upPos.quantity
				if (quantityEdit === 0) return

				status = 'edit'

				return {
					id: position.id,
					amount: upPos.quantity * position.purchasePrice,
					quantity: upPos.quantity,
					quantityEdit: quantityEdit,
					quantityError: position.quantityError || position.quantity
				}
			})
			.filter(Boolean)

		const total = dto.position.reduce(
			(totals, dtoPos) => {
				const position = positionMap.get(dtoPos.id)
				if (dtoPos.quantity > 0)
					totals.amount += dtoPos.quantity * position.purchasePrice
				totals.quant += dtoPos.quantity || 0

				return totals
			},
			{ amount: 0, quant: 0 }
		)

		try {
			await this.prisma.$transaction(async prisma => {
				await prisma.productReception.update({
					where: { id },
					data: {
						status,
						totalAmount: total.amount,
						totalQuantity: total.quant
					}
				})

				await Promise.all(
					updatedPositions.map(pos =>
						prisma.productReceptionPosition.update({
							where: { id: pos.id },
							data: {
								amount: pos.amount,
								quantity: pos.quantity,
								...(pos.quantityEdit !== 0 && {
									quantityEdit: pos.quantityEdit
								}),
								quantityError: pos.quantityError
							}
						})
					)
				)
			})
		} catch (err) {
			handlePrismaError(err, 'Error update Reception', {
				notFound: 'Reception not found'
			})
		}
	}

	async marking(id: string, marking: EnumProductReceptionMarking) {
		try {
			await this.prisma.productReception.update({
				where: { id },
				data: { marking }
			})
		} catch (err) {
			handlePrismaError(err, 'Error marking Reception', {
				notFound: 'Reception not found'
			})
		}
	}
}
