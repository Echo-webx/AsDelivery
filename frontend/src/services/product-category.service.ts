import type {
	IProductCategory,
	IProductCategoryOrTotalPages,
	TypeProductCategoryCreate,
	TypeProductCategoryUpdate
} from '@/types/product-category.types'
import '@/types/product.types'
import type { TypeSearch } from '@/types/root.types'

import { axiosAuth } from '@/api/axios'

class ProductCategoryService {
	private _URL = '/product/category'

	getAll(query: TypeSearch) {
		return axiosAuth.get<IProductCategoryOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	getForUser(id: string, query: TypeSearch) {
		return axiosAuth.get<IProductCategoryOrTotalPages>(
			`${this._URL}/user/${id}`,
			{ params: query }
		)
	}

	create(data: TypeProductCategoryCreate) {
		return axiosAuth.post<IProductCategory>(`${this._URL}`, data)
	}

	update(id: string, data: TypeProductCategoryUpdate) {
		return axiosAuth.put<IProductCategory>(`${this._URL}/${id}`, data)
	}

	delete(id: string) {
		return axiosAuth.delete(`${this._URL}/${id}`)
	}
}

export const productCategoryService = new ProductCategoryService()
