import type { MetadataRoute } from 'next'

import { SITE_NAME } from '@/consts/seo.constants'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: `${SITE_NAME} v2.0`,
		short_name: `${SITE_NAME}`,
		description: `${SITE_NAME} platform`,
		start_url: '/',
		id: '/',
		orientation: 'portrait-primary',
		display: 'standalone',
		background_color: '#0a0a0a',
		theme_color: '#0a0a0a',
		icons: [
			{
				src: '/images/pwa/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable'
			},
			{
				src: '/images/pwa/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable'
			},
			{
				src: '/images/pwa/favicon.svg',
				sizes: 'any',
				type: 'image/svg+xml'
			}
		]
	}
}
