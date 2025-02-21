import axios, { type CreateAxiosDefaults } from 'axios'

import { setupAxiosAuthInterceptors } from './interceptors'
import { API_URL } from '@/consts/api.consts'

const options: CreateAxiosDefaults = {
	adapter: 'fetch',
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosBase = axios.create(options)
const axiosAuth = axios.create(options)
const axiosServer = (accessToken: string) => {
	const instance = axiosBase
	instance.defaults.headers.Authorization = `Bearer ${accessToken}`

	return instance
}

setupAxiosAuthInterceptors(axiosAuth)

export { axiosAuth, axiosBase, axiosServer }
