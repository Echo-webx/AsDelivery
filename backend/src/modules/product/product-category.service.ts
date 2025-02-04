import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Search } from 'src/common/dto/main.dto'
import {
	filterUndefined,
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import {
	ProductCategoryCreateDto,
	ProductCategoryUpdateDto
} from './dto/product.dto'

@Injectable()
export class ProductCategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async getByIdOrLinkUser(id: string, userId: string) {
		return await this.prisma.productCategory.findUnique({
			where: { id },
			include: { linkUsers: { where: { userId } } }
		})
	}

	async getAll(query: Search) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.ProductCategoryWhereInput = {}
		if (query.search) {
			whereConditions.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const [productCategories, totalCount] = await Promise.all([
			this.prisma.productCategory.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				include: {
					linkProducts: {
						include: { product: true }
					}
				},
				orderBy: { name: 'asc' }
			}),
			this.prisma.productCategory.count({
				where: whereConditions
			})
		])
		return { productCategories, totalCount }
	}

	async create(dto: ProductCategoryCreateDto) {
		try {
			return await this.prisma.$transaction(async prisma => {
				const newCategory = await prisma.productCategory.create({
					data: { name: dto.name }
				})

				const productsLinks = dto.productsId.map(productId => ({
					categoryId: newCategory.id,
					productId
				}))
				if (productsLinks.length > 0) {
					await prisma.productToCategory.createMany({
						data: productsLinks
					})
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error create Product category', {
				notUnique: 'Name is not unique'
			})
		}
	}

	async update(id: string, dto: ProductCategoryUpdateDto) {
		const filteredDto = filterUndefined(dto) as ProductCategoryUpdateDto

		try {
			return await this.prisma.$transaction(async prisma => {
				const updatedCategory = await prisma.productCategory.update({
					where: { id },
					data: {
						...filterUndefined({
							name: filteredDto.name
						})
					},
					include: {
						linkProducts: {
							select: { productId: true }
						}
					}
				})

				const currentProductIds = updatedCategory.linkProducts.map(
					product => product.productId
				)

				const productsToRemove = currentProductIds.filter(
					productId => !filteredDto.productsId.includes(productId)
				)
				if (productsToRemove.length > 0) {
					await prisma.productToCategory.deleteMany({
						where: {
							categoryId: id,
							productId: {
								in: productsToRemove
							}
						}
					})
				}

				const productsToAdd = filteredDto.productsId.filter(
					productId => !currentProductIds.includes(productId)
				)
				const productsLinks = productsToAdd.map(productId => ({
					categoryId: id,
					productId
				}))
				if (productsLinks.length > 0) {
					await prisma.productToCategory.createMany({
						data: productsLinks
					})
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error update Product category', {
				notFound: 'Product category not found'
			})
		}
	}

	async delete(id: string) {
		try {
			await this.prisma.productCategory.delete({
				where: { id }
			})
		} catch (err) {
			handlePrismaError(err, 'Error delete Product category', {
				notFound: 'Product category not found'
			})
		}
	}
}
