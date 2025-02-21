import type {
	IReleaseAddressStatistics,
	IReleaseAllStatistics,
	IReleaseNotVisitedStatistics,
	IReleaseOneAddressStatistics,
	IReleaseOneNotVisitedStatistics,
	IReleaseProductStatistics
} from '@/types/release-statistics.types'
import type { TypeSearchIndex } from '@/types/root.types'

import { axiosAuth } from '@/api/axios'

class ReleaseStatisticsService {
	private _URL = '/release/statistics'

	getAll() {
		return axiosAuth.get<IReleaseAllStatistics>(`${this._URL}/all`)
	}

	getProduct(query: TypeSearchIndex) {
		return axiosAuth.get<IReleaseProductStatistics[]>(`${this._URL}/product`, {
			params: query
		})
	}

	getAddress(query: TypeSearchIndex) {
		return axiosAuth.get<IReleaseAddressStatistics[]>(`${this._URL}/address`, {
			params: query
		})
	}

	getOneAddress(id: string, query: TypeSearchIndex) {
		return axiosAuth.get<IReleaseOneAddressStatistics>(
			`${this._URL}/address/${id}`,
			{ params: query }
		)
	}

	getNotVisited(query: TypeSearchIndex) {
		return axiosAuth.get<IReleaseNotVisitedStatistics[]>(
			`${this._URL}/not-visited`,
			{ params: query }
		)
	}

	getOneNotVisited(id: string, query: TypeSearchIndex) {
		return axiosAuth.get<IReleaseOneNotVisitedStatistics>(
			`${this._URL}/not-visited/${id}`,
			{ params: query }
		)
	}
}

export const releaseStatisticsService = new ReleaseStatisticsService()
