import type { IProductOrTotalPages } from '@/types/product.types'
import {
	EnumProductReceptionMarking,
	type IProductReception,
	type IReceptionOrTotalPages,
	type TypeProductReceptionCreate,
	type TypeProductReceptionPositionUpdate
} from '@/types/reception.types'
import type { TypeSearch, TypeSearchDate } from '@/types/root.types'

import { axiosAuth } from '@/api/axios'

class ReceptionService {
	private _URL = '/reception'

	getAll(query: TypeSearch & TypeSearchDate) {
		return axiosAuth.get<IReceptionOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	getOne(id: string) {
		return axiosAuth.get<IProductReception>(`${this._URL}/${id}`)
	}

	getProduct(query: TypeSearch) {
		return axiosAuth.get<IProductOrTotalPages>(`${this._URL}/product`, {
			params: query
		})
	}

	create(data: TypeProductReceptionCreate) {
		return axiosAuth.post(`${this._URL}`, data)
	}

	update(id: string, data: TypeProductReceptionPositionUpdate) {
		return axiosAuth.put(`${this._URL}/${id}`, data)
	}

	marking(id: string, marking: EnumProductReceptionMarking) {
		return axiosAuth.put(`${this._URL}/${id}/marking`, {
			marking
		})
	}
}

export const receptionService = new ReceptionService()
