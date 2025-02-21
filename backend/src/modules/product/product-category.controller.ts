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
import {
	ProductCategoryCreateDto,
	ProductCategoryUpdateDto
} from './dto/product.dto'
import { ProductCategoryService } from './product-category.service'

@Controller('product/category')
export class ProductCategoryController {
	constructor(
		private readonly productCategoryService: ProductCategoryService
	) {}

	@Get()
	@Auth('root')
	async getAll(@Query() query: Search) {
		return this.productCategoryService.getAll(query)
	}

	@HttpCode(200)
	@Post()
	@Auth('root')
	async create(@Body() dto: ProductCategoryCreateDto) {
		return this.productCategoryService.create(dto)
	}

	@HttpCode(200)
	@Put(':id')
	@Auth('root')
	async update(
		@Param() params: CheckId,
		@Body() dto: ProductCategoryUpdateDto
	) {
		return this.productCategoryService.update(params.id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('root')
	async delete(@Param() params: CheckId) {
		return this.productCategoryService.delete(params.id)
	}
}
