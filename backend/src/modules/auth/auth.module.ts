import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { getJwtOptions, JwtConfig } from 'src/config/jwt.config'
import { ExtConfigService } from '../../core/services/config.service'
import { EmailModule } from '../email/email.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { TokenService } from './token.service'

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ExtConfigService],
			useFactory: getJwtOptions
		}),
		UserModule,
		EmailModule
	],
	controllers: [AuthController],
	providers: [AuthService, TokenService, JwtConfig, JwtStrategy],
	exports: [AuthService]
})
export class AuthModule {}
