import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common'
import { EnumUserRole } from '@prisma/client'
import { ExtConfigService } from 'src/core/services/config.service'

@Injectable()
export class CheckWorkTimeGuard implements CanActivate {
	constructor(private readonly config: ExtConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest()
		const user = request.user

		const { startWorking, endWorking } = this.config.getGeneral()
		const currentTime = new Date().getHours()

		if (
			user.role !== EnumUserRole.root &&
			(currentTime < startWorking || currentTime >= endWorking)
		)
			throw new BadRequestException('Outside of working hours')

		return true
	}
}
