import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import { User } from '@prisma/client'
import { SearchOrWeek, SearchWeek } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CheckWorkRegion } from '../../common/decorators/region.decorator'
import { CheckWorkTime } from '../../common/decorators/time.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import { SalaryUpsertDto } from './dto/salary.dto'
import { SalaryService } from './salary.service'

@Controller('salary')
export class SalaryController {
	constructor(private readonly salaryService: SalaryService) {}

	@Get('week')
	@CheckWorkRegion()
	@Auth()
	async getWeek(@Query() query: SearchWeek, @CurrentUser() user: User) {
		return this.salaryService.getStatistics(query.week, user, 'week')
	}

	@Get('month')
	@CheckWorkRegion()
	@Auth()
	async getMonth(@Query() query: SearchWeek, @CurrentUser() user: User) {
		return this.salaryService.getStatistics(query.week, user, 'month')
	}

	@Get('user')
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getFor(@Query() query: SearchOrWeek, @CurrentUser() user: User) {
		return this.salaryService.getFor(query, user)
	}

	@Get()
	@Auth('manager', 'root')
	async getAll(@Query() query: SearchWeek, @CurrentUser() user: User) {
		return this.salaryService.getAll(query.week, user)
	}

	@HttpCode(200)
	@Post()
	@CheckWorkTime()
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async upsert(@Body() dto: SalaryUpsertDto, @CurrentUser() user: User) {
		return this.salaryService.upsert(dto, user)
	}
}
