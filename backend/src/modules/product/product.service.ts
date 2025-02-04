import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Search } from 'src/common/dto/main.dto'
import {
	filterUndefined,
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { ProductCreateDto, ProductUpdateDto } from './dto/product.dto'

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	async getById(id: string) {
		return await this.prisma.product.findUnique({
			where: { id }
		})
	}

	async getByIdOrLinkUser(id: string, userId: string) {
		return await this.prisma.product.findUnique({
			where: { id },
			include: { linkUsers: { where: { userId } } }
		})
	}

	async getAll(query: Search, addWhere?: Prisma.ProductWhereInput) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.ProductWhereInput = {
			...addWhere
		}
		if (query.search) {
			whereConditions.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const [products, totalCount] = await Promise.all([
			this.prisma.product.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				include: {
					linkCategories: {
						include: { category: true }
					},
					linkRegions: {
						include: { region: true }
					}
				},
				orderBy: { name: 'asc' }
			}),
			this.prisma.product.count({
				where: whereConditions
			})
		])
		return { products, totalCount }
	}

	async create(dto: ProductCreateDto) {
		try {
			return await this.prisma.product.create({
				data: {
					visible: dto.visible,
					name: dto.name,
					salePrice: dto.salePrice,
					purchasePrice: dto.purchasePrice
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error create Product', {
				notUnique: 'Name is not unique'
			})
		}
	}

	async update(id: string, dto: ProductUpdateDto) {
		const filteredDto = filterUndefined(dto) as ProductUpdateDto

		try {
			return await this.prisma.product.update({
				where: { id },
				data: {
					...filterUndefined({
						visible: filteredDto.visible,
						name: filteredDto.name,
						salePrice: filteredDto.salePrice,
						purchasePrice: filteredDto.purchasePrice
					})
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error update Product', {
				notFound: 'Product not found'
			})
		}
	}

	async delete(id: string) {
		try {
			await this.prisma.product.delete({
				where: { id }
			})
		} catch (err) {
			handlePrismaError(err, 'Error delete Product', {
				notFound: 'Product not found'
			})
		}
	}
}
