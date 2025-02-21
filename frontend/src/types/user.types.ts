import type { IAddress } from './address.types'
import type { IProductToUser, IUserToRegion } from './intermediate.types'
import type { IRegion } from './regions.types'
import type { IProductRelease } from './release.types'
import type { IRoot } from './root.types'
import type { ISalary } from './salary.types'

export interface IUserInfo extends IRoot {
	name: string
	surname: string
	patronymic: string
	birthday: string
	jobPosition: string
}

export interface IUser extends IRoot {
	email: string
	role: EnumUserRole
	info?: IUserInfo
	salary: ISalary[]
	wages?: number
	productRelease: IProductRelease[]
	linkRegions: IUserToRegion[]
	linkProducts: IProductToUser[]
	activeRegionId: string
	checkRegion: boolean
	count: number
}

export interface IUsersOrTotalPages {
	users: IUser[]
	totalCount: number
}

export interface IUserMap extends IRegion {
	address: IAddress[]
	statistics: IUserMapStatistics
}

export interface IUserMapStatistics {
	confirm: number
	waiting: number
	error: number
}

export type TypeUserCreate = Omit<
	IUserInfo,
	keyof IRoot | 'activeRegionId' | 'count' | 'checkRegion'
> & {
	role: EnumUserRole
	email: string
	checkRegion: string | boolean
}

export type TypeUserUpdate = Partial<TypeUserCreate>

export enum EnumUserRole {
	root = 'root',
	manager = 'manager',
	default = 'default'
}
