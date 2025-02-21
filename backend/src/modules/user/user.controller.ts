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
import { EnumUserRole, User } from '@prisma/client'
import { CheckId, Search } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CheckWorkRegion } from '../../common/decorators/region.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import { UserCreateDto, UserUpdateDto } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('role')
	@Auth('manager', 'root')
	async getRole(@CurrentUser('role') role: EnumUserRole) {
		return role
	}

	@Get()
	@Auth('root')
	async getAll(@Query() query: Search) {
		return this.userService.getUsers(query)
	}

	@Get('manager')
	@Auth('root')
	async getManager(@Query() query: Search) {
		return this.userService.getUsers(query, EnumUserRole.manager)
	}

	@Get('default')
	@CheckWorkRegion()
	@Auth('manager', 'root')
	async getDefault(@Query() query: Search, @CurrentUser() user: User) {
		return this.userService.getUsers(query, EnumUserRole.default, user)
	}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}

	@HttpCode(200)
	@Post()
	@Auth('root')
	async create(@Body() dto: UserCreateDto) {
		return this.userService.create(dto)
	}

	@HttpCode(200)
	@Put(':id')
	@Auth('root')
	async update(@Param() params: CheckId, @Body() dto: UserUpdateDto) {
		return this.userService.update(params.id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('root')
	async delete(@Param() params: CheckId) {
		return this.userService.delete(params.id)
	}
}
