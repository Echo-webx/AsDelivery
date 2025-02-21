import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common'
import { EnumUserRole } from '@prisma/client'

@Injectable()
export class CheckWorkRegionGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest()
		const user = request.user

		if (
			user.role !== EnumUserRole.root &&
			user.checkRegion &&
			!user.activeRegionId
		)
			throw new BadRequestException('Region not activate')

		return true
	}
}
