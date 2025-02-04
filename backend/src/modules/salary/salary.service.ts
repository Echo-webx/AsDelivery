import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { EnumUserRole, Prisma, User } from '@prisma/client'
import { SearchOrWeek } from 'src/common/dto/main.dto'
import {
	getMonthInWeekDate,
	getWeeksInMonth
} from 'src/common/utils/date.utils'
import {
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { UserService } from '../user/user.service'
import { SalaryUpsertDto } from './dto/salary.dto'

@Injectable()
export class SalaryService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService
	) {}

	async getAll(week: string, user: User) {
		const whereConditions: Prisma.SalaryWhereInput = {
			week: week,
			...(user.checkRegion &&
				user.role !== EnumUserRole.root && {
					user: { linkRegions: { some: { regionId: user.activeRegionId } } }
				})
		}
		return await this.prisma.salary.findMany({
			where: whereConditions,
			include: { user: { include: { info: true } } },
			orderBy: { user: { info: { name: 'asc' } } }
		})
	}

	async getFor(query: SearchOrWeek, currentUser: User) {
		return await this.userService.getUsers(
			query,
			EnumUserRole.default,
			currentUser,
			{ salary: { where: { week: query.week } } }
		)
	}

	async getUser(week: string, userId: string, group: 'week' | 'month') {
		const weeksInMonth = getWeeksInMonth(week)
		const salary = await this.prisma.salary.aggregate({
			where: {
				...(group === 'month' ? { week: { in: weeksInMonth } } : { week }),
				userId
			},
			_sum: { wages: true }
		})
		return salary._sum.wages || 0
	}

	async getStatistics(week: string, user: User, group: 'week' | 'month') {
		const weeksInMonth = getWeeksInMonth(week)
		const whereConditions: Prisma.SalaryWhereInput = {
			...(group === 'month' ? { week: { in: weeksInMonth } } : { week }),
			...(user.checkRegion &&
				user.role !== EnumUserRole.root && {
					user: { linkRegions: { some: { regionId: user.activeRegionId } } }
				})
		}
		const salaries = await this.prisma.salary.groupBy({
			by: ['userId'],
			where: whereConditions,
			_sum: { wages: true }
		})
		const userIds = salaries.map(s => s.userId)
		const usersInfo = await this.prisma.userInfo.findMany({
			where: { userId: { in: userIds } }
		})

		return usersInfo.map(user => {
			const wages = salaries.find(s => s.userId === user.userId)._sum.wages
			return { ...user, wages }
		})
	}

	async upsert(dto: SalaryUpsertDto, user: User) {
		const whereConditions: Prisma.SalaryWhereInput = {
			week: dto.week,
			...(user.checkRegion &&
				user.role !== EnumUserRole.root && {
					user: { linkRegions: { some: { regionId: user.activeRegionId } } }
				})
		}
		const exsItems = await this.prisma.salary.findMany({
			where: whereConditions,
			include: { user: true }
		})

		const items = dto.items
		const exsIds = exsItems.map(s => s.id)

		const toCreate = items.filter(item => !exsIds.includes(item.linkId))
		const toUpdate = items.filter(item => {
			const exs = exsItems.find(link => link.id === item.linkId)
			return exs && exs.wages !== item.wages
		})
		const toDelete = exsIds.filter(
			linkId => !items.some(item => item.linkId === linkId)
		)

		try {
			await this.prisma.$transaction(async prisma => {
				if (toDelete.length > 0)
					await prisma.salary.deleteMany({
						where: { id: { in: toDelete } }
					})
				if (toCreate.length > 0)
					await prisma.salary.createMany({
						data: toCreate.map(item => ({
							userId: item.id,
							wages: item.wages,
							week: dto.week,
							month: getMonthInWeekDate(dto.week, item.weekday),
							weekday: item.weekday
						}))
					})
				if (toUpdate.length > 0)
					await Promise.all(
						toUpdate.map(item =>
							prisma.salary.update({
								where: { id: item.linkId },
								data: { wages: item.wages }
							})
						)
					)
			})
		} catch (err) {
			handlePrismaError(err, 'Salary upsert error', {})
		}
	}
}
