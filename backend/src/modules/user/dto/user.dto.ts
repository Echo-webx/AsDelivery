import { PartialType } from '@nestjs/mapped-types'
import { EnumUserRole } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsIn,
	IsMongoId,
	IsNotEmpty,
	IsString
} from 'class-validator'

export class UserCreateDto {
	@IsNotEmpty()
	@IsEnum(EnumUserRole)
	@IsIn([EnumUserRole.default, EnumUserRole.manager])
	role: EnumUserRole

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	surname: string

	@IsNotEmpty()
	@IsString()
	patronymic: string

	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	birthday: Date

	@IsNotEmpty()
	@IsString()
	jobPosition: string

	@IsNotEmpty()
	@IsBoolean()
	checkRegion: boolean
}

export class UserUpdateDto extends PartialType(UserCreateDto) {}

export class UserConnectRegionDto {
	@IsNotEmpty()
	@IsMongoId()
	regionId: string
}
