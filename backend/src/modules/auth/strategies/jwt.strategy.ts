import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ExtConfigService } from 'src/core/services/config.service'
import { UserGetByService } from 'src/modules/user/user-getBy.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly config: ExtConfigService,
		private readonly userGetBy: UserGetByService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false, // true отключает проверку по времени
			secretOrKey: config.get('JWT_ACCESS_SECRET')
		})
	}

	async validate({ id }: { id: string }) {
		const user = await this.userGetBy.id(id)
		if (!user) throw new UnauthorizedException('User not found')

		return user
	}
}
