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
import { ProductCreateDto, ProductUpdateDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	@Auth('root')
	async getAll(@Query() query: Search) {
		return this.productService.getAll(query)
	}

	@HttpCode(200)
	@Post()
	@Auth('root')
	async create(@Body() dto: ProductCreateDto) {
		return this.productService.create(dto)
	}

	@HttpCode(200)
	@Put(':id')
	@Auth('root')
	async update(@Param() params: CheckId, @Body() dto: ProductUpdateDto) {
		return this.productService.update(params.id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('root')
	async delete(@Param() params: CheckId) {
		return this.productService.delete(params.id)
	}
}
