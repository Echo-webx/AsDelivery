import { Injectable } from '@nestjs/common'
import { JwtModuleOptions } from '@nestjs/jwt'
import { ExtConfigService } from 'src/core/services/config.service'

export const getJwtOptions = async (
	config: ExtConfigService
): Promise<JwtModuleOptions> => ({
	secret: config.getOrThrow('JWT_ACCESS_SECRET')
})

@Injectable()
export class JwtConfig {
	constructor(private readonly config: ExtConfigService) {}

	getAccessSecret(): Pick<JwtModuleOptions, 'secret'> {
		return {
			secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET')
		}
	}
	getAccessSignOptions(): Pick<JwtModuleOptions['signOptions'], 'expiresIn'> {
		return {
			expiresIn: `${this.config.getOrThrow<number>('JWT_ACCESS_EXPIRES_IN')}d`
		}
	}
	generateAccess(): JwtModuleOptions {
		return {
			...this.getAccessSecret(),
			...this.getAccessSignOptions()
		}
	}

	getRefreshSecret(): Pick<JwtModuleOptions, 'secret'> {
		return {
			secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET')
		}
	}
	getRefreshSignOptions(): Pick<JwtModuleOptions['signOptions'], 'expiresIn'> {
		return {
			expiresIn: `${this.config.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN')}d`
		}
	}
	generateRefresh(): JwtModuleOptions {
		return {
			...this.getRefreshSecret(),
			...this.getRefreshSignOptions()
		}
	}
}
