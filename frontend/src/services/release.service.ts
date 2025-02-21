import {
	EnumProductReleaseMarking,
	type IProductRelease,
	type IReleaseOrTotalPages,
	type TypeProductReleaseCreate,
	type TypeProductReleasePositionUpdate
} from '@/types/release.types'
import type { TypeSearch, TypeSearchIndex } from '@/types/root.types'

import { axiosAuth } from '@/api/axios'

class ReleaseService {
	private _URL = '/release'

	getAll(query: TypeSearch & TypeSearchIndex) {
		return axiosAuth.get<IReleaseOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	getOne(id: string) {
		return axiosAuth.get<IProductRelease>(`${this._URL}/${id}`)
	}

	getUser(query: TypeSearch) {
		return axiosAuth.get<IReleaseOrTotalPages>(`${this._URL}/user`, {
			params: query
		})
	}

	create(data: TypeProductReleaseCreate) {
		return axiosAuth.post(`${this._URL}`, data)
	}

	update(id: string, data: TypeProductReleasePositionUpdate) {
		return axiosAuth.put(`${this._URL}/${id}`, data)
	}

	marking(id: string, marking: EnumProductReleaseMarking) {
		return axiosAuth.put(`${this._URL}/${id}/marking`, {
			marking: marking
		})
	}
}

export const releaseService = new ReleaseService()
