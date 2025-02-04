import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Search } from 'src/common/dto/main.dto'
import {
	filterUndefined,
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { RegionCreateDto, RegionUpdateDto } from './dto/region.dto'

@Injectable()
export class RegionService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(query: Search) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.RegionWhereInput = {}
		if (query.search) {
			whereConditions.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const [regions, totalCount] = await Promise.all([
			this.prisma.region.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				include: {
					linkAddress: {
						include: { address: true }
					},
					linkProducts: {
						include: { product: true }
					}
				},
				orderBy: { name: 'asc' }
			}),
			this.prisma.region.count({
				where: whereConditions
			})
		])
		return { regions, totalCount }
	}

	async getUser(userId: string, query: Search) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.RegionWhereInput = {
			linkUsers: {
				some: { userId }
			}
		}
		if (query.search) {
			whereConditions.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const [regions, totalCount] = await Promise.all([
			this.prisma.region.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				include: {
					linkUsers: {
						where: { userId }
					},
					linkAddress: true
				},
				orderBy: { name: 'asc' }
			}),
			this.prisma.region.count({
				where: whereConditions
			})
		])
		return { regions, totalCount }
	}

	async create(dto: RegionCreateDto) {
		try {
			return await this.prisma.$transaction(async prisma => {
				const newRegion = await prisma.region.create({
					data: {
						name: dto.name,
						position: dto.position
					}
				})

				const addressLinks = dto.addressId?.map(addressId => ({
					regionId: newRegion.id,
					addressId
				}))
				if (addressLinks?.length > 0) {
					await prisma.addressToRegion.createMany({
						data: addressLinks
					})
				}

				const productLinks = dto.productsId?.map(productId => ({
					regionId: newRegion.id,
					productId
				}))
				if (productLinks?.length > 0) {
					await prisma.productToRegion.createMany({
						data: productLinks
					})
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error create Region', {
				notUnique: 'Name is not unique'
			})
		}
	}

	async update(id: string, dto: RegionUpdateDto) {
		const filteredDto = filterUndefined(dto) as RegionUpdateDto

		try {
			return await this.prisma.$transaction(async prisma => {
				const updatedRegion = await prisma.region.update({
					where: { id },
					data: {
						...filterUndefined({
							name: filteredDto.name,
							position: filteredDto.position
						})
					},
					include: {
						linkAddress: {
							select: { addressId: true }
						},
						linkProducts: {
							select: { productId: true }
						}
					}
				})
				const currentAddressIds = updatedRegion.linkAddress.map(
					address => address.addressId
				)

				const addressToRemove = currentAddressIds.filter(
					addressId => !filteredDto.addressId.includes(addressId)
				)
				if (addressToRemove.length > 0) {
					await prisma.addressToRegion.deleteMany({
						where: {
							regionId: id,
							addressId: {
								in: addressToRemove
							}
						}
					})
				}

				const addressToAdd = filteredDto.addressId.filter(
					addressId => !currentAddressIds.includes(addressId)
				)
				const addressLinks = addressToAdd.map(addressId => ({
					regionId: id,
					addressId
				}))
				if (addressLinks.length > 0) {
					await prisma.addressToRegion.createMany({
						data: addressLinks
					})
				}

				const currentProductsIds = updatedRegion.linkProducts.map(
					product => product.productId
				)

				const productsToRemove = currentProductsIds.filter(
					productId => !filteredDto.productsId.includes(productId)
				)
				if (productsToRemove.length > 0) {
					await prisma.productToRegion.deleteMany({
						where: {
							regionId: id,
							productId: {
								in: productsToRemove
							}
						}
					})
				}

				const productToAdd = filteredDto.productsId.filter(
					productId => !currentProductsIds.includes(productId)
				)
				const productLinks = productToAdd.map(productId => ({
					regionId: id,
					productId
				}))
				if (productLinks.length > 0) {
					await prisma.productToRegion.createMany({
						data: productLinks
					})
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error update Region', {
				notFound: 'Region not found'
			})
		}
	}

	async delete(id: string) {
		try {
			await this.prisma.region.delete({
				where: { id }
			})
		} catch (err) {
			handlePrismaError(err, 'Error delete Region', {
				notFound: 'Region not found'
			})
		}
	}
}
