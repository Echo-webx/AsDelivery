import type { IAddress } from './address.types'
import type { IRoot } from './root.types'
import type { IUser } from './user.types'

export interface IReleaseMonthStatistics {
	month: number
	totalAmount: number
	totalSale: number
	totalSwap: number
	totalBonus: number
	operationCount: number
}

export interface IReleaseUsersStatistics {
	userId: string
	name: string
	surname: string
	patronymic: string
	totalAmount: number
	totalSale: number
	totalSwap: number
	totalBonus: number
	operationCount: number
}

export interface IReleaseAllStatistics {
	month: IReleaseMonthStatistics[]
	users: IReleaseUsersStatistics[]
}

export interface IReleaseProductStatistics extends IRoot {
	name: string
	amount: number
	quantitySale: number
	quantitySwap: number
	quantityBonus: number
	operationCount: number
}

export interface IReleaseAddressStatistics extends IRoot {
	name: string
	totalAmount: number
	totalSale: number
	totalSwap: number
	totalBonus: number
	operationCount: number
}

export interface IReleaseOneAddress {
	archiveAddressId: string
	addressName: string
	addressPosition: string
}

export interface IReleaseOneAddressStatistics extends IRoot {
	address: IReleaseOneAddress
	products: IReleaseProductStatistics[]
}

export interface IReleaseNotVisitedStatistics extends IRoot {
	name: string
	userCount: number
}

export interface IReleaseOneNotVisitedStatistics extends IRoot {
	address: IAddress
	users: IUser[]
}
