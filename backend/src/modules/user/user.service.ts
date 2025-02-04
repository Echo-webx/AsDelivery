import { Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { EnumUserRole, Prisma, User } from '@prisma/client'
import { hash } from 'argon2'
import { Search } from 'src/common/dto/main.dto'
import {
	filterUndefined,
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { UserCreateDto, UserUpdateDto } from './dto/user.dto'
import { UserGetByService } from './user-getBy.service'

import { EmailService } from '../email/email.service'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userGetBy: UserGetByService,
		private readonly emailService: EmailService
	) {}

	async getUsers(
		query: Search,
		role?: EnumUserRole,
		currentUser?: User,
		addInclude?: Prisma.UserInclude
	) {
		const skip = (query.page - 1) * query.limit
		const whereConditions: Prisma.UserWhereInput = {
			role: {
				in: !role
					? ['default', 'manager']
					: role === EnumUserRole.root
						? ['root']
						: role === EnumUserRole.manager
							? ['manager']
							: ['default']
			},
			...(currentUser &&
				currentUser.checkRegion &&
				currentUser.role !== EnumUserRole.root && {
					linkRegions: {
						some: { regionId: currentUser.activeRegionId }
					}
				})
		}
		if (query.search) {
			const searchTerms = query.search.split(' ').filter(term => term)

			whereConditions.AND = searchTerms.map(term => ({
				OR: [
					{ info: { name: { contains: term, mode: 'insensitive' } } },
					{ info: { surname: { contains: term, mode: 'insensitive' } } },
					{ info: { patronymic: { contains: term, mode: 'insensitive' } } }
				]
			}))
		}

		const [usersPre, totalCount] = await Promise.all([
			this.prisma.user.findMany({
				where: whereConditions,
				skip,
				take: query.limit,
				include: { info: true, ...addInclude },
				orderBy: { info: { name: 'asc' } }
			}),
			this.prisma.user.count({
				where: whereConditions
			})
		])
		const users = await Promise.all(
			usersPre.map(async user => {
				const {
					password,
					resetPasswordToken,
					resetPasswordTimeOut,
					...userWithoutPassword
				} = user
				return {
					...userWithoutPassword,
					...(role === EnumUserRole.default && {
						wages: await this.userGetBy.idOnlySalaryMonth(user.id)
					})
				}
			})
		)
		return { users, totalCount }
	}

	async getProfile(id: string) {
		const { password, resetPasswordToken, resetPasswordTimeOut, ...user } =
			await this.userGetBy.idAll(id)

		return {
			...user
		}
	}

	async create(dto: UserCreateDto) {
		const genPassword = createId().slice(0, 8)
		const password = await hash(genPassword)

		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					role: dto.role,
					password,
					checkRegion: dto.checkRegion,
					info: {
						create: {
							name: dto.name,
							surname: dto.name,
							patronymic: dto.patronymic,
							birthday: dto.birthday,
							jobPosition: dto.jobPosition
						}
					}
				},
				include: { info: true }
			})
			await this.emailService.sendWelcomeEmail(user.email, genPassword)
			return user
		} catch (err) {
			handlePrismaError(err, 'Error create User', {
				notUnique: 'Email is not unique'
			})
		}
	}

	async update(id: string, dto: UserUpdateDto) {
		const filteredDto = filterUndefined(dto) as UserUpdateDto

		try {
			return await this.prisma.user.update({
				where: { id },
				data: {
					...filterUndefined({
						role: filteredDto.role,
						email: filteredDto.email,
						checkRegion: filteredDto.checkRegion
					}),
					info: {
						update: {
							...filterUndefined({
								name: filteredDto.name,
								surname: filteredDto.surname,
								patronymic: filteredDto.patronymic,
								birthday: filteredDto.birthday,
								jobPosition: filteredDto.jobPosition
							})
						}
					}
				},
				include: { info: true }
			})
		} catch (err) {
			handlePrismaError(err, 'Error update User', {
				notFound: 'User not found'
			})
		}
	}

	async delete(id: string) {
		try {
			await this.prisma.user.delete({
				where: { id }
			})
		} catch (err) {
			handlePrismaError(err, 'Error delete User', {
				notFound: 'User not found'
			})
		}
	}
}
