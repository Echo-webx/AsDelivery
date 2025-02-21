import Cookies from 'js-cookie'

import { DOMAIN, TOKEN_EXPIRES } from '@/consts/api.consts'
import { IS_DEV } from '@/consts/base.consts'

export enum EnumTokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken'
}

export const getAccessToken = () => Cookies.get(EnumTokens.ACCESS_TOKEN) || null
export const saveAccessToken = (accessToken: string) =>
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: DOMAIN,
		secure: !IS_DEV,
		sameSite: 'strict',
		expires: TOKEN_EXPIRES
	})
export const removeAccessToken = () => Cookies.remove(EnumTokens.ACCESS_TOKEN)
