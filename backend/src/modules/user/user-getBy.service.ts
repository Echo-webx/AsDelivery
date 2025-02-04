import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { EnumUserRole, Prisma } from '@prisma/client'
import { format } from 'date-fns'
import { PrismaService } from 'src/core/services/prisma.service'
import { SalaryService } from '../salary/salary.service'

@Injectable()
export class UserGetByService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(forwardRef(() => SalaryService))
		private readonly salaryService: SalaryService
	) {}

	async id(id: string) {
		return await this.prisma.user.findUnique({
			where: { id }
		})
	}

	async email(email: string) {
		return await this.prisma.user.findUnique({
			where: { email }
		})
	}

	async idAndRole(
		id: string,
		role: EnumUserRole,
		additional?: Prisma.UserWhereInput
	) {
		return await this.prisma.user.findUnique({
			where: { id, role, AND: { ...additional } }
		})
	}

	async idAndRoleOrRegionsId(
		id: string,
		role: EnumUserRole,
		additional?: Prisma.UserWhereInput
	) {
		return await this.prisma.user.findUnique({
			where: { id, role, AND: { ...additional } },
			include: {
				linkRegions: {
					select: { regionId: true }
				}
			}
		})
	}

	async idAndRoleOrRegionsIdAndLinkItem(
		id: string,
		role: EnumUserRole,
		additional?: Prisma.UserWhereInput
	) {
		return await this.prisma.user.findUnique({
			where: { id, role, AND: { ...additional } },
			include: {
				linkRegions: {
					select: { regionId: true }
				},
				linkProducts: true,
				linkProductCategories: true
			}
		})
	}

	async idOrRegionsId(id: string) {
		return await this.prisma.user.findUnique({
			where: { id },
			include: {
				linkRegions: {
					select: { regionId: true }
				}
			}
		})
	}

	async idAll(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				info: true,
				linkRegions: {
					include: { region: true }
				}
			}
		})
		return { ...user, wages: await this.idOnlySalaryMonth(user.id) }
	}

	async idOnlySalaryMonth(id: string) {
		const week = format(new Date(), "yyyy-'W'ww")
		return await this.salaryService.getUser(week, id, 'month')
	}

	async idOnlySalaryWeek(id: string) {
		const week = format(new Date(), "yyyy-'W'ww")
		return await this.salaryService.getUser(week, id, 'week')
	}
}
