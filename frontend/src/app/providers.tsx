'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'

import { LoaderProvider } from '@/providers/LoaderProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

// Подключаем конфиг dayjs
import '@/config/day-js.config'

export function Providers({ children }: PropsWithChildren) {
	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false,
					refetchOnReconnect: true
				}
			}
		})
	)

	return (
		<QueryClientProvider client={client}>
			<ThemeProvider>
				<LoaderProvider>{children}</LoaderProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}
