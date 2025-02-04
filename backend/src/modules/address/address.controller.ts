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
import { User } from '@prisma/client'
import { CheckId, Search } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CheckWorkRegion } from '../../common/decorators/region.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import { AddressService } from './address.service'
import { AddressCreateDto, AddressUpdateDto } from './dto/address.dto'

@Controller('address')
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	@Get()
	@Auth('root')
	async getAll(@Query() query: Search) {
		return this.addressService.getAll(query)
	}

	@Get('user')
	@CheckWorkRegion()
	@Auth('default')
	async getAddress(@Query() query: Search, @CurrentUser() user: User) {
		return this.addressService.getAddress(query, user)
	}

	@HttpCode(200)
	@Post()
	@Auth('root')
	async create(@Body() dto: AddressCreateDto) {
		return this.addressService.create(dto)
	}

	@HttpCode(200)
	@Put(':id')
	@Auth('root')
	async update(@Param() params: CheckId, @Body() dto: AddressUpdateDto) {
		return this.addressService.update(params.id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('root')
	async delete(@Param() params: CheckId) {
		return this.addressService.delete(params.id)
	}
}
