import type {
	IRegionsOrTotalPages,
	TypeRegionCreate,
	TypeRegionUpdate
} from '@/types/regions.types'
import type { TypeSearch } from '@/types/root.types'

import { axiosAuth } from '@/api/axios'

class RegionService {
	private _URL = '/region'

	getAll(query: TypeSearch) {
		return axiosAuth.get<IRegionsOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	create(data: TypeRegionCreate) {
		return axiosAuth.post(`${this._URL}`, data)
	}

	update(id: string, data: TypeRegionUpdate) {
		return axiosAuth.put(`${this._URL}/${id}`, data)
	}

	delete(id: string) {
		return axiosAuth.delete(`${this._URL}/${id}`)
	}
}

export const regionService = new RegionService()
