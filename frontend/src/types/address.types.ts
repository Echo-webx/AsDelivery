import type { IAddressToRegion } from './intermediate.types'
import type { IProductRelease } from './release.types'
import type { IRoot } from './root.types'

export interface IAddress extends IRoot {
	name: string
	position: string
	status?: EnumAddressStatus
	linkRegions: IAddressToRegion[]
	productRelease: IProductRelease[]
}

export interface IAddressOrTotalPages {
	address: IAddress[]
	totalCount: number
}

export type TypeAddressCreate = {
	name: string
	position?: string
}

export type TypeAddressUpdate = Partial<TypeAddressCreate>

export enum EnumAddressStatus {
	confirm = 'confirm',
	warning = 'warning',
	error = 'error'
}
