import type { IGeneral, TypeGeneral } from '@/types/general.types'

import { axiosAuth } from '@/api/axios'

class GeneralService {
	private _URL = '/general'

	getGeneralSettings() {
		return axiosAuth.get<TypeGeneral>(`${this._URL}/settings`)
	}

	getGeneral() {
		return axiosAuth.get<IGeneral>(`${this._URL}`)
	}

	putGeneral(data: IGeneral) {
		return axiosAuth.put<IGeneral>(`${this._URL}`, data)
	}
}

export const generalService = new GeneralService()
