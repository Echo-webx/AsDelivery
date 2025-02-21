import { NextRequest, NextResponse } from 'next/server'

import { MAIN_PAGES } from './config/pages-url.config'
import { authService } from './services/auth.service'
import { EnumTokens } from './services/token.service'
import { userService } from './services/user.service'
import { EnumUserRole } from './types/user.types'

export async function middleware(request: NextRequest) {
	const { url, cookies } = request

	const accessToken = cookies.get(EnumTokens.ACCESS_TOKEN)?.value
	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value

	const isAuthPage = url.includes('/auth')
	const isDashboardPage = url.includes('/dashboard')
	const isYieldsPage = url.includes('/yields')
	const isResetPage = url.match(/\/reset\/([^/]+)/)

	if (isDashboardPage && accessToken && refreshToken) {
		try {
			const { data } = await userService.getRole(accessToken)
			if (data === EnumUserRole.root) {
				return NextResponse.next()
			} else {
				return NextResponse.rewrite(new URL('/not-found', request.url))
			}
		} catch (err) {
			return NextResponse.rewrite(new URL('/not-found', request.url))
		}
	}

	if (isYieldsPage && accessToken && refreshToken) {
		try {
			const { data } = await userService.getRole(accessToken)
			if (data === EnumUserRole.root || data === EnumUserRole.manager)
				return NextResponse.next()
			return NextResponse.rewrite(new URL('/not-found', request.url))
		} catch (err) {
			return NextResponse.rewrite(new URL('/not-found', request.url))
		}
	}

	if (isResetPage) {
		const { data } = await authService.checkReset(isResetPage[1])
		if (data) return NextResponse.next()
		return NextResponse.rewrite(new URL('/not-found', request.url))
	}

	if (isAuthPage && accessToken && refreshToken) {
		return NextResponse.redirect(new URL(MAIN_PAGES.HOME, url))
	}

	if (!isAuthPage && (!refreshToken || !accessToken)) {
		return NextResponse.redirect(new URL('/auth', url))
	}

	if (isAuthPage) {
		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/',
		'/auth/:path*',
		'/manage/:path*',
		'/yields/:path*',
		'/release/:path*',
		'/dashboard/:path*',
		'/me/:path*'
	]
}
