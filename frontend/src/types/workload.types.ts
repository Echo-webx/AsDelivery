import type { IProductCategory } from './product-category.types'
import type { IProduct } from './product.types'

export type IItems = IProduct & IProductCategory

export interface IItemsOrTotalPages {
	items: IItems[]
	totalCount: number
}

export type TypeWorkloadItem = {
	id: string
	linkId: string
	group: 'category' | 'product' | null
	count: number
}

export type TypeWorkloadUpsert = {
	userId: string
	items: TypeWorkloadItem[]
}
