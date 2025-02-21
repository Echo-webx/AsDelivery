import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import type { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'

import './globals.scss'
import { Providers } from './providers'
import { NO_INDEX_PAGE, SITE_NAME } from '@/consts/seo.constants'

const zen = Noto_Sans({
	subsets: ['cyrillic', 'latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-zen',
	style: ['normal']
})

export const metadata: Metadata = {
	...NO_INDEX_PAGE,
	title: {
		default: SITE_NAME,
		template: `${SITE_NAME} %s`
	},
	description: `${SITE_NAME} platform`,
	applicationName: SITE_NAME,
	icons: {
		shortcut: '/images/favicon.ico',
		icon: [
			{
				url: '/images/pwa/favicon-48x48.png',
				type: 'image/png',
				sizes: '48x48'
			},
			{
				url: '/images/pwa/favicon.svg',
				type: 'image/svg+xml'
			}
		],
		apple: '/images/pwa/apple-touch-icon.png'
	},
	appleWebApp: {
		title: SITE_NAME,
		statusBarStyle: 'default'
	}
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<html
			lang='ru'
			suppressHydrationWarning
		>
			<body className={zen.className}>
				<Providers>
					{children}
					<Toaster
						position='top-right'
						reverseOrder={false}
						toastOptions={{
							className: 'toaster',
							duration: 1600
						}}
					/>
				</Providers>
			</body>
		</html>
	)
}
