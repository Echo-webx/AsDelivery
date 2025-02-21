import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query
} from '@nestjs/common'
import { User } from '@prisma/client'
import { CheckId, Search } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import { UserConnectRegionDto } from './dto/user.dto'
import { UserRelationService } from './user-relation.service'

@Controller('user')
export class UserRelationController {
	constructor(private readonly userRelationService: UserRelationService) {}

	@HttpCode(200)
	@Post('active/region/:regionId')
	@Auth()
	async activeRegion(@Param() params: CheckId, @CurrentUser('id') id: string) {
		return this.userRelationService.activeRegion(id, params.regionId)
	}

	@HttpCode(200)
	@Get('map')
	@Auth()
	async getMap(@CurrentUser() user: User) {
		return this.userRelationService.getMap(user)
	}

	@Get(':id/region')
	@Auth('root')
	async getRegions(@Param() params: CheckId, @Query() query: Search) {
		return this.userRelationService.getRegions(params.id, query)
	}

	@HttpCode(200)
	@Post(':id/region')
	@Auth('root')
	async addRegion(@Param() params: CheckId, @Body() dto: UserConnectRegionDto) {
		return this.userRelationService.addRegion(params.id, dto)
	}

	@HttpCode(200)
	@Delete(':id/region/:regionId')
	@Auth('root')
	async deleteRegion(@Param() params: CheckId) {
		return this.userRelationService.deleteRegion(params.id, params.regionId)
	}
}
