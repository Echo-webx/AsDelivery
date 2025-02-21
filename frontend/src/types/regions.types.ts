import type {
	IAddressToRegion,
	IProductToRegion,
	IUserToRegion
} from './intermediate.types'
import type { IProductRelease } from './release.types'
import type { IRoot } from './root.types'

export interface IRegion extends IRoot {
	name: string
	position?: string
	linkUsers: IUserToRegion[]
	linkAddress: IAddressToRegion[]
	linkProducts: IProductToRegion[]
	productRelease: IProductRelease[]
}

export interface IRegionsOrTotalPages {
	regions: IRegion[]
	totalCount: number
}

export type TypeRegionCreate = {
	name: string
	position?: string
	addressId: string[]
	productsId: string[]
}

export type TypeRegionUpdate = Partial<TypeRegionCreate>
