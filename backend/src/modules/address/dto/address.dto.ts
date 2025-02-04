import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export enum EnumAddressStatus {
	confirm = 'confirm',
	waiting = 'waiting',
	error = 'error'
}

export class AddressCreateDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	position?: string
}

export class AddressUpdateDto extends PartialType(AddressCreateDto) {}
