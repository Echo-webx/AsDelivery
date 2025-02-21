import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

export class LoginDto {
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@MinLength(6, {
		message: 'Пароль должен быть не менее 6 символов'
	})
	@MaxLength(36, {
		message: 'Пароль должен быть не более 36 символов'
	})
	@IsString()
	password: string
}

export class ResetDto {
	@IsNotEmpty()
	@IsString()
	token: string

	@IsNotEmpty()
	@MinLength(6, {
		message: 'Пароль должен быть не менее 6 символов'
	})
	@MaxLength(36, {
		message: 'Пароль должен быть не более 36 символов'
	})
	@IsString()
	password: string
}

export class EmailDto {
	@IsNotEmpty()
	@IsEmail()
	email: string
}
