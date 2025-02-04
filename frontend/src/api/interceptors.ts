import { type AxiosInstance, isAxiosError } from 'axios'

import { authService } from '@/services/auth.service'
import { getAccessToken, removeAccessToken } from '@/services/token.service'

export const setupAxiosAuthInterceptors = (axiosAuth: AxiosInstance) => {
	axiosAuth.interceptors.request.use(value => {
		const accessToken = getAccessToken()
		if (accessToken) value.headers.Authorization = `Bearer ${accessToken}`

		return value
	})

	axiosAuth.interceptors.response.use(null, async error => {
		if (isAxiosError(error)) {
			const originalRequest: any = error.config
			const validRequest =
				error?.response?.status === 401 &&
				(error.message === 'jwt expired' ||
					error.message === 'jwt must be provided')

			if (!originalRequest._isRetry && validRequest) {
				originalRequest._isRetry = true

				try {
					await authService.getNewTokens()
					return axiosAuth.request(originalRequest)
				} catch (err) {
					if (validRequest) {
						removeAccessToken()
					}
					throw err
				}
			}
		}

		return error
	})
}
