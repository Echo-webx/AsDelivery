import { EnumSalaryWeekday } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	Max,
	Min,
	ValidateNested
} from 'class-validator'

export class SalaryItemDto {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	id: string

	@IsOptional()
	@IsString()
	@IsMongoId()
	linkId: string

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(99999999)
	wages: number

	@IsNotEmpty()
	@IsEnum(EnumSalaryWeekday)
	weekday: EnumSalaryWeekday
}

export class SalaryUpsertDto {
	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{4}-W\d{2}$/)
	week: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SalaryItemDto)
	items: SalaryItemDto[]
}
