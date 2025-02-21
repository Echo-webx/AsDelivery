import { EnumProductReceptionMarking } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateIf,
	ValidateNested
} from 'class-validator'

export class ReceptionPositionDto {
	@IsOptional()
	@IsString()
	@IsMongoId()
	id?: string

	@ValidateIf(o => !o.id)
	@IsNotEmpty()
	@IsString()
	name?: string

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	quantity: number

	@ValidateIf(o => !o.id)
	@IsNotEmpty()
	@IsNumber()
	purchasePrice?: number
}

export class ReceptionCreateDto {
	@IsNotEmpty()
	@IsString()
	vendor: string

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ReceptionPositionDto)
	items: ReceptionPositionDto[]
}

export class ReceptionPositionUpdateDto {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	id: string

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999)
	quantity: number
}

export class ReceptionUpdateDto {
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ReceptionPositionUpdateDto)
	position: ReceptionPositionUpdateDto[]
}

export class MarkingReceptionUpdate {
	@IsNotEmpty()
	@IsEnum(EnumProductReceptionMarking)
	marking: EnumProductReceptionMarking
}
