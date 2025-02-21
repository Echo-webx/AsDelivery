import { EnumProductReleaseMarking } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsIn,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	Min,
	ValidateNested
} from 'class-validator'

export class ReleasePositionDto {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	id: string

	@IsNotEmpty()
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
	quantitySale: number

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	quantitySwap: number

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	quantityBonus: number
}

export class ReleaseCreateDto {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	addressId: string

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ReleasePositionDto)
	items: ReleasePositionDto[]
}

export class ReleasePositionUpdateDto {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	id: string

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	quantitySale: number

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	quantitySwap: number

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	quantityBonus: number
}

export class ReleaseUpdateDto {
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ReleasePositionUpdateDto)
	position: ReleasePositionUpdateDto[]
}

export class MarkingReleaseUpdate {
	@IsNotEmpty()
	@IsEnum(EnumProductReleaseMarking)
	marking: EnumProductReleaseMarking
}
