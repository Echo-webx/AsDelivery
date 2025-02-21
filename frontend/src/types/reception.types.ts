import type { IProduct } from './product.types'
import type { IRoot } from './root.types'
import type { IUser } from './user.types'

export interface IProductReceptionPosition extends IRoot {
	archiveProductId?: string
	productId?: string
	product?: IProduct
	name: string
	purchasePrice: number
	amount: number
	quantity: number
	quantityError?: number
}

export interface IProductReception extends IRoot {
	archiveUserId: string
	userId?: string
	user?: IUser
	tag: string
	status: EnumProductReceptionStatus
	marking?: EnumProductReceptionMarking
	vendor: string
	totalAmount: number
	totalQuantity: number
	userFIO: string
	position?: IProductReceptionPosition[]
}

export interface IReceptionOrTotalPages {
	reception: IProductReception[]
	totalCount: number
	statistics: ReceptionStatistics
	editReceptions?: IProductReception[]
}

export interface ReceptionStatistics {
	totalAmount: number
}

export type TypeProductReceptionPosition = {
	id?: string
	name?: string
	quantity: number
	purchasePrice?: number
}

export type TypeProductReceptionCreate = {
	vendor: string
	items: TypeProductReceptionPosition[]
}

export type TypeProductReceptionPositionUpdate = {
	position: Array<Required<Omit<TypeProductReceptionPosition, 'name'>>>
}

export enum EnumProductReceptionStatus {
	confirm = 'confirm',
	edit = 'edit'
}

export enum EnumProductReceptionMarking {
	accounting = 'accounting',
	deleted = 'deleted',
	null = 'null'
}
