import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Req,
	Res
} from '@nestjs/common'
import { Request, Response } from 'express'
import { Token } from 'src/common/dto/main.dto'
import { AuthService } from './auth.service'
import { EmailDto, LoginDto, ResetDto } from './dto/auth.dto'
import { TokenService } from './token.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService
	) {}

	@HttpCode(200)
	@Post('login')
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.login(dto)
		this.tokenService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('update-token')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const { accessTokenFromHeaders, refreshTokenFromCookies } =
			this.tokenService.verifyTokensFromClient(req, res)

		const { refreshToken, ...response } = await this.tokenService.getNewToken(
			accessTokenFromHeaders,
			refreshTokenFromCookies
		)

		this.tokenService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('pre-reset')
	async preReset(@Body() dto: EmailDto) {
		return this.authService.preReset(dto)
	}

	@HttpCode(200)
	@Get('reset/:token')
	async checkReset(@Param() params: Token) {
		return this.authService.checkReset(params.token)
	}

	@HttpCode(200)
	@Post('reset')
	async reset(@Body() dto: ResetDto) {
		return this.authService.reset(dto)
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.tokenService.removeRefreshTokenFromResponse(res)

		return true
	}
}
