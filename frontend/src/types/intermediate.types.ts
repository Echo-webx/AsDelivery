import type { IAddress } from './address.types'
import type { IProductCategory } from './product-category.types'
import type { IProduct } from './product.types'
import type { IRegion } from './regions.types'
import type { IRoot } from './root.types'
import type { IUser } from './user.types'

export interface IUserToRegion extends IRoot {
	userId: string
	user?: IUser
	regionId: string
	region?: IRegion
}

export interface IAddressToRegion extends IRoot {
	regionId: string
	region?: IRegion
	addressId: string
	address?: IAddress
}

export interface IProductToUser extends IRoot {
	userId: string
	user?: IUser
	productId: string
	product?: IProduct

	count: number
}

export interface IProductToRegion extends IRoot {
	regionId: string
	region?: IRegion
	productId: string
	product?: IProduct
}

export interface IProductToCategory extends IRoot {
	categoryId: string
	category?: IProductCategory
	productId: string
	product?: IProduct
}
