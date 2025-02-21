import type { IProductToCategory } from './intermediate.types'
import type { IRoot } from './root.types'

export interface IProductCategory extends IRoot {
	name: string
	linkProducts: IProductToCategory[]
}

export interface IProductCategoryOrTotalPages {
	productCategories: IProductCategory[]
	totalCount: number
}

export type TypeProductCategoryCreate = Omit<
	IProductCategory,
	keyof IRoot | 'linkProducts'
> & {
	productsId: string[]
}

export type TypeProductCategoryUpdate = Partial<TypeProductCategoryCreate>
