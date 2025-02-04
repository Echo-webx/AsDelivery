import { SetMetadata, UseGuards } from '@nestjs/common'

import { EnumUserRole } from '@prisma/client'
import { JwtAuthGuard } from '../guards/jwt.guard'

export const ROLES_KEY = 'roles'

export const Auth = (...roles: EnumUserRole[]) => {
	return (
		target: any,
		key: string | symbol,
		descriptor: TypedPropertyDescriptor<any>
	) => {
		SetMetadata(ROLES_KEY, roles)(target, key, descriptor)
		UseGuards(JwtAuthGuard)(target, key, descriptor)
	}
}
