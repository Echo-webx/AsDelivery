import { Module } from '@nestjs/common'
import { ProductCategoryController } from './product-category.controller'
import { ProductCategoryService } from './product-category.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
	controllers: [ProductController, ProductCategoryController],
	providers: [ProductService, ProductCategoryService],
	exports: [ProductService, ProductCategoryService]
})
export class ProductModule {}
