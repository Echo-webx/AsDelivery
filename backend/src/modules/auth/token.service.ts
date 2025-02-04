import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { Request, Response } from 'express'
import { isDev } from 'src/common/utils/is-dev.util'
import { JwtConfig } from 'src/config/jwt.config'
import { UserGetByService } from 'src/modules/user/user-getBy.service'
import { ExtConfigService } from '../../core/services/config.service'

@Injectable()
export class TokenService {
	constructor(
		private readonly configService: ExtConfigService,
		private readonly jwt: JwtService,
		private readonly jwtConfig: JwtConfig,
		private readonly userGetBy: UserGetByService
	) {}

	REFRESH_TOKEN_NAME = 'refreshToken'

	async buildResponseObject(
		user: Omit<User, 'password' | 'resetPasswordToken' | 'resetPasswordTimeOut'>
	) {
		const tokens = await this.issueTokens(user.id)
		return { user, ...tokens }
	}

	// Token created-passed

	async getNewToken(accessToken: string, refreshToken: string) {
		const { userData } = await this.verifyTokens(accessToken, refreshToken)
		return this.buildResponseObject(userData)
	}

	// Generated access-refresh token

	async issueTokens(userId: string) {
		const payload = { id: userId }

		const accessConfig = this.jwtConfig.generateAccess()
		const refreshConfig = this.jwtConfig.generateRefresh()

		const accessToken = await this.jwt.signAsync(payload, accessConfig)
		const refreshToken = await this.jwt.signAsync(payload, refreshConfig)

		return { accessToken, refreshToken }
	}

	// Verify jwt token

	async verifyTokens(accessToken: string, refreshToken: string) {
		const resultAccess = await this.verifyAccessToken(accessToken).catch(() => {
			throw new UnauthorizedException('Invalid access token')
		})

		const resultRefresh = await this.verifyRefreshToken(refreshToken).catch(
			() => {
				throw new UnauthorizedException('Invalid refresh token')
			}
		)

		if (!resultRefresh.id && resultRefresh.id !== resultAccess.id)
			throw new UnauthorizedException(
				'Invalid refresh token or access token mismatch'
			)

		const userData = await this.userGetBy.id(resultRefresh.id)
		if (!userData) throw new NotFoundException('User not found')

		return { resultAccess, resultRefresh, userData }
	}

	async verifyAccessToken(accessToken: string) {
		const accessConfig = this.jwtConfig.getAccessSecret()
		return await this.jwt.verifyAsync(accessToken, {
			...accessConfig,
			ignoreExpiration: true
		})
	}

	async verifyRefreshToken(refreshToken: string) {
		const refreshConfig = this.jwtConfig.getRefreshSecret()
		return await this.jwt.verifyAsync(refreshToken, refreshConfig)
	}

	verifyTokensFromClient(req: Request, res: Response) {
		const accessTokenFromHeaders = req.headers.authorization?.split(' ')[1]
		if (!accessTokenFromHeaders) {
			this.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Access token not passed')
		}

		const refreshTokenFromCookies = req.cookies[this.REFRESH_TOKEN_NAME]
		if (!refreshTokenFromCookies) {
			this.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		return { accessTokenFromHeaders, refreshTokenFromCookies }
	}

	// Add and remove cookie refresh tokens

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(
			expiresIn.getDate() + this.configService.get<number>('REFRESH_EXPIRES_IN')
		)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.configService.get('DOMAIN'),
			expires: expiresIn,
			secure: !isDev(this.configService),
			sameSite: this.configService.get('SAME_SITE')
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.configService.get('DOMAIN'),
			expires: new Date(0),
			secure: !isDev(this.configService),
			sameSite: this.configService.get('SAME_SITE')
		})
	}
}
