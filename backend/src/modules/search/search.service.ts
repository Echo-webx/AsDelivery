import { Injectable } from '@nestjs/common'
import {
	EnumProductReceptionMarking,
	EnumProductReleaseMarking,
	EnumUserRole,
	Prisma,
	User
} from '@prisma/client'
import { compareAsc } from 'date-fns'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class SearchService {
	constructor(private readonly prisma: PrismaService) {}

	async get(user: User, search?: string) {
		if (!search || search === '') return

		const whereReleases: Prisma.ProductReleaseWhereInput = {
			...(user.checkRegion &&
				user.role !== EnumUserRole.root && {
					regionId: user.activeRegionId
				}),
			...(user.role === EnumUserRole.default && { userId: user.id }),
			...(user.role !== EnumUserRole.root && {
				marking: { not: EnumProductReleaseMarking.deleted }
			})
		}
		whereReleases.OR = [
			{ tag: { contains: search, mode: 'insensitive' } },
			{ addressName: { contains: search, mode: 'insensitive' } }
		]

		const whereReceptions: Prisma.ProductReceptionWhereInput = {
			...(user.role !== EnumUserRole.root && {
				userId: user.id,
				marking: { not: EnumProductReceptionMarking.deleted }
			})
		}
		whereReceptions.OR = [
			{ tag: { contains: search, mode: 'insensitive' } },
			{ vendor: { contains: search, mode: 'insensitive' } }
		]

		const productReleases = await this.prisma.productRelease.findMany({
			where: whereReleases,
			take: 10,
			orderBy: { createdAt: 'desc' }
		})

		const productReceptions = await this.prisma.productReception.findMany({
			where: whereReceptions,
			take: 10,
			orderBy: { createdAt: 'desc' }
		})

		const combinedResults = [...productReleases, ...productReceptions]

		return combinedResults.sort((a, b) => compareAsc(a.createdAt, b.createdAt))
	}
}
