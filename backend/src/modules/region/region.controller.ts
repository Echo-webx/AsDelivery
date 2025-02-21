import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query
} from '@nestjs/common'
import { CheckId, Search } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { RegionCreateDto, RegionUpdateDto } from './dto/region.dto'
import { RegionService } from './region.service'

@Controller('region')
export class RegionController {
	constructor(private readonly regionService: RegionService) {}

	@Get()
	@Auth('root')
	async getAll(@Query() query: Search) {
		return this.regionService.getAll(query)
	}

	@HttpCode(200)
	@Post()
	@Auth('root')
	async create(@Body() dto: RegionCreateDto) {
		return this.regionService.create(dto)
	}

	@HttpCode(200)
	@Put(':id')
	@Auth('root')
	async update(@Param() params: CheckId, @Body() dto: RegionUpdateDto) {
		return this.regionService.update(params.id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('root')
	async delete(@Param() params: CheckId) {
		return this.regionService.delete(params.id)
	}
}
