import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { endOfDay, startOfDay } from 'date-fns'
import { Search } from 'src/common/dto/main.dto'
import { ExtConfigService } from 'src/core/services/config.service'
import {
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { EnumAddressStatus } from '../address/dto/address.dto'
import { RegionService } from '../region/region.service'
import { UserConnectRegionDto } from './dto/user.dto'
import { UserGetByService } from './user-getBy.service'

@Injectable()
export class UserRelationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userGetBy: UserGetByService,
		private readonly regionService: RegionService,
		private readonly extendConfig: ExtConfigService
	) {}

	async activeRegion(id: string, regionId: string) {
		try {
			return await this.prisma.user.update({
				where: { id },
				data: { activeRegionId: regionId }
			})
		} catch (err) {
			handlePrismaError(err, 'Error active region User', {
				notFound: 'User not found'
			})
		}
	}

	async getMap(user: User) {
		if (!user.activeRegionId) return null
		const currentDate = new Date()
		const currentTime = currentDate.getHours()
		const { startWorking, endWorking } = this.extendConfig.getGeneral()

		const position = await this.prisma.region
			.findUnique({
				where: { id: user.activeRegionId },
				include: {
					linkAddress: {
						select: {
							address: {
								include: {
									productRelease: {
										where: {
											createdAt: {
												gte: startOfDay(currentDate),
												lte: endOfDay(currentDate)
											}
										},
										select: { id: true },
										take: 1
									}
								}
							}
						}
					}
				}
			})
			.then(r => {
				if (!r) return null

				const { linkAddress, ...rest } = r

				const address = linkAddress.map(link => {
					const productRelease = link.address.productRelease[0]
					return {
						...link.address,
						status: productRelease
							? EnumAddressStatus.confirm
							: currentTime < startWorking || currentTime >= endWorking
								? EnumAddressStatus.error
								: EnumAddressStatus.waiting
					}
				})

				return { ...rest, address }
			})

		const statistics = {
			confirm: position.address.filter(
				a => a.status === EnumAddressStatus.confirm
			).length,
			waiting: position.address.filter(
				a => a.status === EnumAddressStatus.waiting
			).length,
			error: position.address.filter(a => a.status === EnumAddressStatus.error)
				.length
		}

		return { ...position, statistics }
	}

	async getRegions(id: string, query: Search) {
		const user = await this.userGetBy.id(id)
		if (!user) throw new BadRequestException('User not found')

		return await this.regionService.getUser(user.id, query)
	}

	async addRegion(id: string, dto: UserConnectRegionDto) {
		try {
			await this.prisma.userToRegion.create({
				data: { userId: id, regionId: dto.regionId }
			})
		} catch (err) {
			handlePrismaError(err, 'Error add region User', {
				notFound: 'User or Region not found',
				notUnique: 'User already has a region'
			})
		}
	}

	async deleteRegion(id: string, regionId: string) {
		try {
			const user = await this.prisma.user.update({
				where: { id, linkRegions: { some: { regionId } } },
				data: {
					linkRegions: {
						delete: {
							regionId_userId: {
								regionId,
								userId: id
							}
						}
					}
				}
			})

			if (user.activeRegionId === regionId)
				await this.prisma.user.update({
					where: { id: user.id },
					data: { activeRegion: { disconnect: true } }
				})
		} catch (err) {
			handlePrismaError(err, 'Error delete region User', {
				notFound: 'User or Region connection not found'
			})
		}
	}
}
