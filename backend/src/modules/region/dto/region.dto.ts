import { PartialType } from '@nestjs/mapped-types'
import {
	ArrayNotEmpty,
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator'

export class RegionCreateDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	position?: string

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsMongoId({ each: true })
	addressId: string[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@IsMongoId({ each: true })
	productsId?: string[]
}

export class RegionUpdateDto extends PartialType(RegionCreateDto) {}
