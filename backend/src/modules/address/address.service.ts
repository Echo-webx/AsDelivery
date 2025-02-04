import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { Search } from 'src/common/dto/main.dto'
import {
	filterUndefined,
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { AddressCreateDto, AddressUpdateDto } from './dto/address.dto'

@Injectable()
export class AddressService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(query: Search) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.AddressWhereInput = {}
		if (query.search) {
			whereConditions.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const [address, totalCount] = await Promise.all([
			this.prisma.address.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				include: {
					linkRegions: { include: { region: true } }
				},
				orderBy: { name: 'asc' }
			}),
			this.prisma.address.count({
				where: whereConditions
			})
		])
		return { address, totalCount }
	}

	async getAddress(query: Search, user: User) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.AddressWhereInput = {
			linkRegions: {
				some: { regionId: user.activeRegionId }
			}
		}
		if (query.search) {
			whereConditions.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } }
			]
		}

		const [address, totalCount] = await Promise.all([
			this.prisma.address.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				orderBy: { name: 'asc' }
			}),
			this.prisma.address.count({
				where: whereConditions
			})
		])
		return { address, totalCount }
	}

	async create(dto: AddressCreateDto) {
		try {
			return await this.prisma.address.create({
				data: {
					name: dto.name,
					position: dto.position
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error create Region', {
				notUnique: 'Name is not unique'
			})
		}
	}

	async update(id: string, dto: AddressUpdateDto) {
		try {
			const filteredDto = filterUndefined(dto) as AddressUpdateDto

			return await this.prisma.address.update({
				where: { id },
				data: {
					...filterUndefined({
						name: filteredDto.name,
						position: filteredDto.position
					})
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error update Address', {
				notFound: 'Address not found',
				notUnique: 'Name is not unique'
			})
		}
	}

	async delete(id: string) {
		try {
			await this.prisma.address.delete({
				where: { id }
			})
		} catch (err) {
			handlePrismaError(err, 'Error delete Address', {
				notFound: 'Address not found'
			})
		}
	}
}
