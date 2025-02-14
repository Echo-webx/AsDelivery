import type { IUser } from './user.types'

export interface IAuth {
	accessToken: string
	user: IUser
}

export type TypeLogin = {
	email: string
	password: string
}

export type TypeEmail = {
	email: string
}

export type TypeReset = {
	token?: string
	password: string
	passwordConfirm: string
}
