import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query
} from '@nestjs/common'
import { User } from '@prisma/client'
import { CheckId, SearchOrIndex } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CheckWorkRegion } from '../../common/decorators/region.decorator'
import { CheckWorkTime } from '../../common/decorators/time.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import {
	MarkingReleaseUpdate,
	ReleaseCreateDto,
	ReleaseUpdateDto
} from './dto/release.dto'
import { ReleaseService } from './release.service'

@Controller('release')
export class ReleaseController {
	constructor(private readonly releaseService: ReleaseService) {}

	@Get()
	@CheckWorkRegion()
	@Auth()
	async getAll(@Query() query: SearchOrIndex, @CurrentUser() user: User) {
		return this.releaseService.getAll(query, user)
	}

	@Get(':id')
	@CheckWorkRegion()
	@Auth()
	async getOne(@Param() params: CheckId, @CurrentUser() user: User) {
		return this.releaseService.getOne(params.id, user)
	}

	@HttpCode(200)
	@Post()
	@CheckWorkTime()
	@CheckWorkRegion()
	@Auth('default')
	async create(@Body() dto: ReleaseCreateDto, @CurrentUser() user: User) {
		return this.releaseService.create(user, dto)
	}

	@HttpCode(200)
	@Put(':id')
	@CheckWorkTime()
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async update(
		@Param() params: CheckId,
		@Body() dto: ReleaseUpdateDto,
		@CurrentUser() user: User
	) {
		return this.releaseService.update(params.id, dto, user)
	}

	@HttpCode(200)
	@Put(':id/marking')
	@Auth('root')
	async marking(@Param() params: CheckId, @Body() dto: MarkingReleaseUpdate) {
		return this.releaseService.marking(params.id, dto.marking)
	}
}
