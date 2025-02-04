import type { TypeSearch } from '@/types/root.types'
import type {
	ISalary,
	ISalaryStatistics,
	TypeSalaryUpsert
} from '@/types/salary.types'
import type { IUsersOrTotalPages } from '@/types/user.types'

import { axiosAuth } from '@/api/axios'

class SalaryService {
	private _URL = '/salary'

	getStatistics(week: string, group: 'week' | 'month') {
		return axiosAuth.get<ISalaryStatistics[]>(`${this._URL}/${group}`, {
			params: { week }
		})
	}

	getFor(week: string, query: TypeSearch) {
		return axiosAuth.get<IUsersOrTotalPages>(`${this._URL}/user`, {
			params: { week, ...query }
		})
	}

	getAll(week: string) {
		return axiosAuth.get<ISalary[]>(`${this._URL}`, {
			params: { week }
		})
	}

	upsert(data: TypeSalaryUpsert) {
		return axiosAuth.post(`${this._URL}`, data)
	}
}

export const salaryService = new SalaryService()
