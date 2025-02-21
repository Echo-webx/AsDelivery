import type {
	IAddress,
	IAddressOrTotalPages,
	TypeAddressCreate,
	TypeAddressUpdate
} from '@/types/address.types'
import type { TypeSearch } from '@/types/root.types'

import { axiosAuth } from '@/api/axios'

class AddressService {
	private _URL = '/address'

	getAll(query: TypeSearch) {
		return axiosAuth.get<IAddressOrTotalPages>(`${this._URL}`, {
			params: query
		})
	}

	getForUser(query: TypeSearch) {
		return axiosAuth.get<IAddressOrTotalPages>(`${this._URL}/user`, {
			params: query
		})
	}

	create(data: TypeAddressCreate) {
		return axiosAuth.post<IAddress>(`${this._URL}`, data)
	}

	update(id: string, data: TypeAddressUpdate) {
		return axiosAuth.put<IAddress>(`${this._URL}/${id}`, data)
	}

	delete(id: string) {
		return axiosAuth.delete(`${this._URL}/${id}`)
	}
}

export const addressService = new AddressService()
