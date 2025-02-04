import type {
	IProductToCategory,
	IProductToRegion,
	IProductToUser
} from './intermediate.types'
import type { IRoot } from './root.types'

export interface IProduct extends IRoot {
	visible: EnumProductVisible
	name: string
	salePrice: number
	purchasePrice: number
	linkCategories: IProductToCategory[]
	linkRegions: IProductToRegion[]
	linkUsers: IProductToUser[]
}

export interface IProductOrTotalPages {
	products: IProduct[]
	totalCount: number
}

export type TypeProductCreate = Omit<IProduct, keyof IRoot | 'linkCategories'>

export type TypeProductUpdate = Partial<TypeProductCreate>

export enum EnumProductVisible {
	all = 'all',
	release = 'release',
	reception = 'reception'
}
