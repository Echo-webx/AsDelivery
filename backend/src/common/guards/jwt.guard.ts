import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { EnumUserRole } from '@prisma/client'
import { ROLES_KEY } from '../decorators/auth.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private reflector: Reflector) {
		super()
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		await super.canActivate(context)

		const roles = this.reflector.getAllAndOverride<EnumUserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (!roles || roles.length === 0) return true

		const request = context.switchToHttp().getRequest()

		const { role } = request.user
		if (!roles.includes(role)) {
			throw new UnauthorizedException()
		}

		return true
	}
	// Добавить если нужно явно выводить в ответе <jwt expired>
	// handleRequest(err: any, user: any, info: any) {
	// 	if (err || !user) {
	// 		if (info instanceof TokenExpiredError) {
	// 			throw new UnauthorizedException('jwt expired')
	// 		}
	// 		throw err || new UnauthorizedException()
	// 	}
	// 	return user
	// }
}
