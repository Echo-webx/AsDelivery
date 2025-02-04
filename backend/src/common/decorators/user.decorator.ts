import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user: User = request.user

		return data ? user?.[data] : user
	}
)
