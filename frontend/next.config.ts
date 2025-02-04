import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

import { IS_DEV } from '@/consts/base.consts'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					}
				]
			},
			{
				source: '/pwa/sw.js',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript; charset=utf-8'
					},
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate'
					},
					{
						key: 'Content-Security-Policy',
						value: "default-src 'self'; script-src 'self'"
					}
				]
			}
		]
	}
}

export default withPWA({
	dest: 'public/pwa',
	disable: IS_DEV
	// swSrc: 'service-worker.js' // необходим для настройки pwa создается отдельно настраиваем и после генерируется sw.js
})(nextConfig as any)
// FIXME: Проблема с типами
