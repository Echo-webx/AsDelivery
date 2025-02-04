import { BadRequestException, Injectable } from '@nestjs/common'
import {
	EnumProductReleaseMarking,
	EnumUserRole,
	Prisma,
	User
} from '@prisma/client'
import { endOfDay, endOfYear, startOfDay, startOfYear } from 'date-fns'
import { SearchIndex } from 'src/common/dto/main.dto'
import { PrismaService } from 'src/core/services/prisma.service'

export interface ProductReleaseRawMonth {
	month: number
	totalAmount: number
	totalSale: number
	totalSwap: number
	totalBonus: number
	count: number
}

@Injectable()
export class ReleaseStatisticsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllOnYear() {
		const date = new Date()
		const startYear = startOfYear(date)
		const endYear = endOfYear(date)

		const month: ProductReleaseRawMonth[] = await this.prisma.productRelease
			.aggregateRaw({
				pipeline: [
					{
						$match: {
							marking: { $ne: EnumProductReleaseMarking.deleted },
							created_at: {
								$gte: { $date: startYear },
								$lte: { $date: endYear }
							}
						}
					},
					{
						$group: {
							_id: { month: { $month: '$created_at' } },
							totalAmount: { $sum: '$total_amount' },
							totalSale: { $sum: '$total_sale' },
							totalSwap: { $sum: '$total_swap' },
							totalBonus: { $sum: '$total_bonus' },
							count: { $sum: 1 }
						}
					}
				]
			})
			.then((r: any) =>
				r.map((rItem: any) => {
					const { _id, count, ...res } = rItem
					return {
						month: _id.month,
						...res,
						operationCount: count
					}
				})
			)

		const usersStatistics = await this.prisma.productRelease
			.groupBy({
				by: ['userId'],
				where: {
					marking: { not: EnumProductReleaseMarking.deleted },
					createdAt: { gte: startYear, lte: endYear },
					userId: { not: null }
				},
				_sum: {
					totalAmount: true,
					totalSale: true,
					totalSwap: true,
					totalBonus: true
				},
				_count: true
			})
			.then(r =>
				r.map(rItem => {
					return {
						userId: rItem.userId,
						...rItem._sum,
						operationCount: rItem._count
					}
				})
			)

		const userIds = usersStatistics.map(r => r.userId)

		const users = await this.prisma.userInfo.findMany({
			where: { userId: { in: userIds } },
			select: { userId: true, name: true, surname: true, patronymic: true }
		})

		const groupUser = usersStatistics
			.map(stat => {
				const { userId, ...user } = users.find(
					user => user.userId === stat.userId
				)
				return {
					...stat,
					...user
				}
			})
			.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))

		return { month, users: groupUser }
	}

	async getProduct(
		query: SearchIndex,
		user: User,
		additional?: Prisma.ProductReleasePositionWhereInput
	) {
		const whereConditions: Prisma.ProductReleasePositionWhereInput = {
			productRelease: {
				...(user.role !== EnumUserRole.root &&
					user.checkRegion && {
						regionId: user.activeRegionId
					}),
				...(user.role === EnumUserRole.default
					? { userId: user.id }
					: query.index !== 'all' && {
							userId: query.index
						}),
				marking: { not: EnumProductReleaseMarking.deleted },
				createdAt: {
					gte: startOfDay(query.date),
					lte: endOfDay(query.dateTo || query.date)
				}
			},
			AND: {
				...additional
			}
		}

		const statistics = await this.prisma.productReleasePosition.groupBy({
			by: ['archiveProductId', 'name'],
			where: whereConditions,
			_sum: {
				amount: true,
				quantitySale: true,
				quantitySwap: true,
				quantityBonus: true
			},
			_count: true,
			orderBy: {
				name: 'asc'
			}
		})

		return statistics.map(item => ({
			id: item.archiveProductId,
			name: item.name,
			amount: item._sum.amount,
			quantitySale: item._sum.quantitySale,
			quantitySwap: item._sum.quantitySwap,
			quantityBonus: item._sum.quantityBonus,
			operationCount: item._count
		}))
	}

	async getAddress(query: SearchIndex, user: User) {
		const whereConditions: Prisma.ProductReleaseWhereInput = {
			...(user.role !== EnumUserRole.root &&
				user.checkRegion && {
					regionId: user.activeRegionId
				}),
			...(user.role === EnumUserRole.default
				? { userId: user.id }
				: query.index !== 'all' && {
						userId: query.index
					}),
			marking: { not: EnumProductReleaseMarking.deleted },
			createdAt: {
				gte: startOfDay(query.date),
				lte: endOfDay(query.dateTo || query.date)
			}
		}

		const statistics = await this.prisma.productRelease.groupBy({
			by: ['archiveAddressId', 'addressName'],
			where: whereConditions,
			_sum: {
				totalAmount: true,
				totalSale: true,
				totalSwap: true,
				totalBonus: true
			},
			_count: true,
			orderBy: {
				addressName: 'asc'
			}
		})

		return statistics.map(item => ({
			id: item.archiveAddressId,
			name: item.addressName,
			totalAmount: item._sum.totalAmount,
			totalSale: item._sum.totalSale,
			totalSwap: item._sum.totalSwap,
			totalBonus: item._sum.totalBonus,
			operationCount: item._count
		}))
	}

	async getOneAddress(id: string, query: SearchIndex, user: User) {
		const address = await this.prisma.productRelease.findFirst({
			where: {
				archiveAddressId: id,
				...(user.role !== EnumUserRole.root &&
					user.checkRegion && {
						regionId: user.activeRegionId
					}),
				...(user.role === EnumUserRole.default && { userId: user.id }),
				marking: { not: EnumProductReleaseMarking.deleted }
			},
			select: {
				archiveAddressId: true,
				addressName: true,
				addressPosition: true
			}
		})
		if (!address) throw new BadRequestException('Address not found')

		const products = await this.getProduct(query, user, {
			productRelease: { archiveAddressId: id }
		})

		return { address, products }
	}

	async getNotVisited(query: SearchIndex, user: User) {
		const notVisitedAddressIds = await this.prisma.address.findMany({
			where: {
				linkRegions: {
					some: {
						...(user.role !== EnumUserRole.root &&
							user.checkRegion && {
								regionId: user.activeRegionId
							}),
						region: {
							linkUsers: {
								some: {
									...(user.role === EnumUserRole.default
										? { userId: user.id }
										: query.index !== 'all' && {
												userId: query.index
											})
								}
							}
						}
					}
				},
				productRelease: {
					none: {
						marking: { not: EnumProductReleaseMarking.deleted },
						createdAt: {
							gte: startOfDay(query.date),
							lte: endOfDay(query.dateTo || query.date)
						}
					}
				}
			},
			select: {
				id: true,
				name: true,
				linkRegions: { select: { regionId: true } }
			}
		})

		const notVisitedAddressesWithUserCounts = await Promise.all(
			notVisitedAddressIds.map(async address => {
				const regionIds = address.linkRegions.map(r => r.regionId)
				const userCount = await this.prisma.user.count({
					where: {
						role: EnumUserRole.default,
						linkRegions: { some: { regionId: { in: regionIds } } }
					}
				})
				return { id: address.id, name: address.name, userCount }
			})
		)

		return notVisitedAddressesWithUserCounts
	}

	async getOneNotVisited(id: string, user: User) {
		const address = await this.prisma.address.findUnique({
			where: {
				id,
				...(user.role !== EnumUserRole.root &&
					user.checkRegion && {
						linkRegions: {
							some: { regionId: user.activeRegionId }
						}
					})
			},
			include: { linkRegions: { select: { regionId: true } } }
		})
		if (!address) throw new BadRequestException('Address not found')

		const regionIds = address.linkRegions.map(r => r.regionId)
		const users = await this.prisma.user.findMany({
			where: {
				role: EnumUserRole.default,
				linkRegions: { some: { regionId: { in: regionIds } } }
			},
			select: { id: true, email: true, createdAt: true, info: true }
		})

		return { address, users }
	}
}
