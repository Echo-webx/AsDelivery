import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { hash, verify } from 'argon2'
import {
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { v4 as uuidV4 } from 'uuid'
import { EmailService } from '../email/email.service'
import { UserGetByService } from '../user/user-getBy.service'
import { EmailDto, LoginDto, ResetDto } from './dto/auth.dto'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly tokenService: TokenService,
		private readonly emailService: EmailService,
		private readonly userGetBy: UserGetByService
	) {}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		return this.tokenService.buildResponseObject(user)
	}

	async preReset(dto: EmailDto) {
		const resetPasswordToken = uuidV4()
		try {
			const user = await this.prisma.user.update({
				where: { email: dto.email },
				data: {
					resetPasswordToken,
					resetPasswordTimeOut: new Date(Date.now() + 60 * 60 * 1000)
				}
			})
			const resetUrl = `/auth/reset/${resetPasswordToken}`
			await this.emailService.sendPasswordResetEmail(user.email, resetUrl)
		} catch (err) {
			handlePrismaError(err, 'Error pre reset User', {
				notFound: 'Email is incorrect'
			})
		}
	}

	async checkReset(token: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				resetPasswordToken: token,
				resetPasswordTimeOut: {
					gt: new Date()
				}
			}
		})
		if (!user) return false
		return true
	}

	async reset(dto: ResetDto) {
		const user = await this.prisma.user.findFirst({
			where: {
				resetPasswordToken: dto.token,
				resetPasswordTimeOut: {
					gt: new Date()
				}
			}
		})
		if (!user) throw new BadRequestException('User not found or token expired')

		const password = await hash(dto.password)

		try {
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					password,
					resetPasswordToken: null,
					resetPasswordTimeOut: null
				}
			})
		} catch (err) {
			handlePrismaError(err, 'Error reset User', {
				notFound: 'User not found'
			})
		}
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.userGetBy.email(dto.email)
		if (!user) throw new BadRequestException('Email or password invalid')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Email or password invalid')

		return user
	}
}
