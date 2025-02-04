import { QueryClient } from '@tanstack/react-query'

import type { IAuth, TypeEmail, TypeLogin, TypeReset } from '@/types/auth.types'

import { axiosAuth } from '@/api/axios'

import { removeAccessToken, saveAccessToken } from './token.service'

class AuthService {
	private _URL = '/auth'

	async login(data: TypeLogin) {
		const response = await axiosAuth.post<IAuth>(`${this._URL}/login`, data)
		if (response.data.accessToken) saveAccessToken(response.data.accessToken)

		return response
	}

	async getNewTokens() {
		const response = await axiosAuth.post<IAuth>(`${this._URL}/update-token`)
		if (response.data.accessToken) saveAccessToken(response.data.accessToken)

		return response
	}

	preReset(data: TypeEmail) {
		return axiosAuth.post(`${this._URL}/pre-reset`, data)
	}

	checkReset(token: string) {
		return axiosAuth.get<boolean>(`${this._URL}/reset/${token}`)
	}

	reset(data: TypeReset) {
		return axiosAuth.post(`${this._URL}/reset`, data)
	}

	async logout(queryClient: QueryClient) {
		const response = await axiosAuth.post<boolean>(`${this._URL}/logout`)

		removeAccessToken()
		queryClient.clear()

		return response
	}
}

export const authService = new AuthService()
