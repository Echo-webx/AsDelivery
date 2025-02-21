import { PartialType } from '@nestjs/mapped-types'
import { EnumProductVisible } from '@prisma/client'
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsString,
	Min
} from 'class-validator'

export class ProductCategoryCreateDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsMongoId({ each: true })
	productsId: string[]
}

export class ProductCategoryUpdateDto extends PartialType(
	ProductCategoryCreateDto
) {}

export class ProductCreateDto {
	@IsNotEmpty()
	@IsEnum(EnumProductVisible)
	visible: EnumProductVisible

	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	salePrice: number

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	purchasePrice: number
}

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}
