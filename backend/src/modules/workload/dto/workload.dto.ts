import { Type } from 'class-transformer'
import {
	IsArray,
	IsIn,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateNested
} from 'class-validator'

export class WorkloadItemDto {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	id: string

	@IsOptional()
	@IsString()
	@IsMongoId()
	linkId: string

	@IsNotEmpty()
	@IsIn(['category', 'product'])
	group: 'category' | 'product'

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	count: number
}

export class WorkloadUpsertDto {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	userId: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WorkloadItemDto)
	items: WorkloadItemDto[]
}
