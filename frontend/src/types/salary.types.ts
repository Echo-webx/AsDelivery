import type { IRoot } from './root.types'
import type { IUser, IUserInfo } from './user.types'

export enum EnumSalaryWeekday {
	monday = 'monday',
	tuesday = 'tuesday',
	wednesday = 'wednesday',
	thursday = 'thursday',
	friday = 'friday',
	saturday = 'saturday',
	sunday = 'sunday'
}

export interface ISalary extends IRoot {
	user: IUser
	week: number
	weekday: EnumSalaryWeekday
	wages: number
}

export interface ISalaryStatistics extends IUserInfo {
	wages: number
}

export type TypeSalaryItem = {
	id: string
	linkId: string
	weekday: EnumSalaryWeekday
	wages: number
}

export type TypeSalaryUpsert = {
	week: string
	items: TypeSalaryItem[]
}
