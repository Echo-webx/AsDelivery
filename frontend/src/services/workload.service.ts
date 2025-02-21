import type { TypeSearch } from '@/types/root.types'
import type {
	IItems,
	IItemsOrTotalPages,
	TypeWorkloadUpsert
} from '@/types/workload.types'

import { axiosAuth } from '@/api/axios'

class WorkloadService {
	private _URL = '/workload'

	getAll(query: TypeSearch) {
		return axiosAuth.get<IItemsOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	getUser(id: string) {
		return axiosAuth.get<IItems[]>(`${this._URL}/${id}`)
	}

	getForUser(id: string, query: TypeSearch) {
		return axiosAuth.get<IItemsOrTotalPages>(`${this._URL}/for/${id}`, {
			params: query
		})
	}

	upsert(data: TypeWorkloadUpsert) {
		return axiosAuth.post(`${this._URL}`, data)
	}
}

export const workloadService = new WorkloadService()
