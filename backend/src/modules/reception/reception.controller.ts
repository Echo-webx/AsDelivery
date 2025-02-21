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
import { CheckId, Search, SearchOrIndex } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CheckWorkRegion } from '../../common/decorators/region.decorator'
import { CheckWorkTime } from '../../common/decorators/time.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import {
	MarkingReceptionUpdate,
	ReceptionCreateDto,
	ReceptionUpdateDto
} from './dto/reception.dto'
import { ReceptionService } from './reception.service'

@Controller('reception')
export class ReceptionController {
	constructor(private readonly receptionService: ReceptionService) {}

	@Get()
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getAll(@Query() query: SearchOrIndex, @CurrentUser() user: User) {
		return this.receptionService.getAll(query, user)
	}

	@Get('product')
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getProduct(@Query() query: Search) {
		return this.receptionService.getProduct(query)
	}

	@Get(':id')
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getOne(@Param() params: CheckId, @CurrentUser() user: User) {
		return this.receptionService.getOne(params.id, user)
	}

	@HttpCode(200)
	@Post()
	@CheckWorkTime()
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async create(@Body() dto: ReceptionCreateDto, @CurrentUser() user: User) {
		return this.receptionService.create(user, dto)
	}

	@HttpCode(200)
	@Put(':id')
	@CheckWorkTime()
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async update(
		@Param() params: CheckId,
		@Body() dto: ReceptionUpdateDto,
		@CurrentUser() user: User
	) {
		return this.receptionService.update(params.id, dto, user)
	}

	@HttpCode(200)
	@Put(':id/marking')
	@Auth('root')
	async marking(@Param() params: CheckId, @Body() dto: MarkingReceptionUpdate) {
		return this.receptionService.marking(params.id, dto.marking)
	}
}
