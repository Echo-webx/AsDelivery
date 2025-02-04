import type { IRegionsOrTotalPages } from '@/types/regions.types'
import type { TypeSearch } from '@/types/root.types'
import type {
	EnumUserRole,
	IUser,
	IUserMap,
	IUsersOrTotalPages,
	TypeUserCreate,
	TypeUserUpdate
} from '@/types/user.types'

import { axiosAuth, axiosServer } from '@/api/axios'

class UserService {
	private _URL = '/user'

	getRole(accessToken: string) {
		return axiosServer(accessToken).get<EnumUserRole>(`${this._URL}/role`)
	}

	getUsers(query: TypeSearch) {
		return axiosAuth.get<IUsersOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	getUsersManager(query: TypeSearch) {
		return axiosAuth.get<IUsersOrTotalPages>(`${this._URL}/manager`, {
			params: query
		})
	}

	getUsersDefault(query: TypeSearch) {
		return axiosAuth.get<IUsersOrTotalPages>(`${this._URL}/default`, {
			params: query
		})
	}

	getMap() {
		return axiosAuth.get<IUserMap>(`${this._URL}/map`)
	}

	getUserMap(id: string) {
		return axiosAuth.get<IUserMap>(`${this._URL}/${id}/map`)
	}

	getUserRegions(id: string, query: TypeSearch) {
		return axiosAuth.get<IRegionsOrTotalPages>(`${this._URL}/${id}/region`, {
			params: query
		})
	}

	addUserRegion(id: string, regionId: string) {
		return axiosAuth.post(`${this._URL}/${id}/region`, {
			regionId: regionId
		})
	}

	deleteUserRegion(id: string, regionId: string) {
		return axiosAuth.delete(`${this._URL}/${id}/region/${regionId}`)
	}

	activeRegion(id: string) {
		return axiosAuth.post(`${this._URL}/active/region/${id}`)
	}

	getProfile() {
		return axiosAuth.get<IUser>(`${this._URL}/profile`)
	}

	create(data: TypeUserCreate) {
		return axiosAuth.post(`${this._URL}`, data)
	}

	update(id: string, data: TypeUserUpdate) {
		return axiosAuth.put<IUser>(`${this._URL}/${id}`, data)
	}

	delete(id: string) {
		return axiosAuth.delete(`${this._URL}/${id}`)
	}
}

export const userService = new UserService()
