import { Controller, Get, Param, Query } from '@nestjs/common'
import { User } from '@prisma/client'
import { CheckId, SearchIndex } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CheckWorkRegion } from '../../common/decorators/region.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import { ReleaseStatisticsService } from './release-statistics.service'

@Controller('release/statistics')
export class ReleaseStatisticsController {
	constructor(
		private readonly releaseStatisticsService: ReleaseStatisticsService
	) {}

	@Get('all')
	@CheckWorkRegion()
	@Auth('root')
	async getAll() {
		return this.releaseStatisticsService.getAllOnYear()
	}

	@Get('product')
	@CheckWorkRegion()
	@Auth()
	async getProduct(@Query() query: SearchIndex, @CurrentUser() user: User) {
		return this.releaseStatisticsService.getProduct(query, user)
	}

	@Get('address')
	@CheckWorkRegion()
	@Auth()
	async getAddress(@Query() query: SearchIndex, @CurrentUser() user: User) {
		return this.releaseStatisticsService.getAddress(query, user)
	}

	@Get('address/:id')
	@CheckWorkRegion()
	@Auth()
	async getOneAddress(
		@Param() params: CheckId,
		@Query() query: SearchIndex,
		@CurrentUser() user: User
	) {
		return this.releaseStatisticsService.getOneAddress(params.id, query, user)
	}

	@Get('not-visited')
	@CheckWorkRegion()
	@Auth()
	async getNotVisited(@Query() query: SearchIndex, @CurrentUser() user: User) {
		return this.releaseStatisticsService.getNotVisited(query, user)
	}

	@Get('not-visited/:id')
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getOneNotVisited(@Param() params: CheckId, @CurrentUser() user: User) {
		return this.releaseStatisticsService.getOneNotVisited(params.id, user)
	}
}
