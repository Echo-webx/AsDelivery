import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Query
} from '@nestjs/common'
import { User } from '@prisma/client'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CheckWorkRegion } from 'src/common/decorators/region.decorator'
import { CurrentUser } from 'src/common/decorators/user.decorator'
import { CheckId, Search } from 'src/common/dto/main.dto'
import { CheckWorkTime } from '../../common/decorators/time.decorator'
import { WorkloadUpsertDto } from './dto/workload.dto'
import { WorkloadService } from './workload.service'

@Controller('workload')
export class WorkloadController {
	constructor(private readonly workloadService: WorkloadService) {}

	@Get('for/:id')
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getForUser(
		@Param() params: CheckId,
		@Query() query: Search,
		@CurrentUser() user: User
	) {
		return this.workloadService.getForUser(params.id, query, user)
	}

	@Get(':id')
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getUser(@Param() params: CheckId, @CurrentUser() user: User) {
		return this.workloadService.getUser(params.id, user)
	}

	@Get()
	@CheckWorkRegion()
	@Auth('default')
	async getAll(@Query() query: Search, @CurrentUser() user: User) {
		return this.workloadService.getAll(query, user)
	}

	@HttpCode(200)
	@Post()
	@CheckWorkTime()
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async upsert(@Body() dto: WorkloadUpsertDto, @CurrentUser() user: User) {
		return this.workloadService.upsert(dto, user)
	}
}
