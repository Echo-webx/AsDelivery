import type { IAddress } from './address.types'
import type { IProduct } from './product.types'
import type { IRegion } from './regions.types'
import type { IRoot } from './root.types'
import type { IUser } from './user.types'

export interface IProductReleasePosition extends IRoot {
	archiveProductId: string
	productId?: string
	product?: IProduct
	name: string
	salePrice: number
	purchasePrice: number
	count: number
	countEdit: number
	countError: number
	amount: number
	quantitySale: number
	quantitySwap: number
	quantityBonus: number
}

export interface IProductRelease extends IRoot {
	archiveUserId: string
	userId?: string
	user?: IUser
	archiveAddressId: string
	addressId?: string
	address?: IAddress
	archiveRegionId: string
	regionId?: string
	region?: IRegion
	tag: string
	status: EnumProductReleaseStatus
	marking?: EnumProductReleaseMarking
	totalAmount: number
	totalSale: number
	totalSwap: number
	totalBonus: number
	totalCount: number
	totalCountEdit?: number
	totalCountError?: number
	userFIO: string
	addressName: string
	regionName: string
	position?: IProductReleasePosition[]
}

export interface IReleaseOrTotalPages {
	release: IProductRelease[]
	totalCount: number
	statistics: ReleaseStatistics
	errorReleases?: IProductRelease[]
	editReleases?: IProductRelease[]
}

export interface ReleaseStatistics {
	totalAmount: number
	totalSale: number
	totalSwap: number
	totalBonus: number
}

export type TypeProductReleasePosition = {
	id: string
	linkId: string
	group: 'category' | 'product' | null
	quantitySale: number
	quantitySwap: number
	quantityBonus: number
}

export type TypeProductReleaseCreate = {
	addressId: string
	items: TypeProductReleasePosition[]
}

export type TypeProductReleasePositionUpdate = {
	position: Array<Omit<TypeProductReleasePosition, 'linkId' | 'group'>>
}

export enum EnumProductReleaseStatus {
	confirm = 'confirm',
	warning = 'warning',
	edit = 'edit',
	error = 'error'
}
export enum EnumProductReleaseMarking {
	accounting = 'accounting',
	deleted = 'deleted',
	null = 'null'
}
