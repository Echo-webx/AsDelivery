import type {
	IProductOrTotalPages,
	TypeProductCreate,
	TypeProductUpdate
} from '@/types/product.types'
import type { TypeSearch } from '@/types/root.types'

import { axiosAuth } from '@/api/axios'

class ProductService {
	private _URL = '/product'

	getAll(query: TypeSearch) {
		return axiosAuth.get<IProductOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	getForUser(id: string, query: TypeSearch) {
		return axiosAuth.get<IProductOrTotalPages>(`${this._URL}/user/${id}`, {
			params: query
		})
	}

	create(data: TypeProductCreate) {
		return axiosAuth.post(`${this._URL}`, data)
	}

	update(id: string, data: TypeProductUpdate) {
		return axiosAuth.put(`${this._URL}/${id}`, data)
	}

	delete(id: string) {
		return axiosAuth.delete(`${this._URL}/${id}`)
	}
}

export const productService = new ProductService()
