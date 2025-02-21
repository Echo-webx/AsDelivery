import type { ISearch } from '@/types/search.types'

import { axiosAuth } from '@/api/axios'

class SearchService {
	private _URL = '/search'

	get(search: string) {
		return axiosAuth.get<ISearch[]>(`${this._URL}`, {
			params: { search }
		})
	}
}

export const searchService = new SearchService()
