'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

export function ThemeProvider({ children }: PropsWithChildren) {
	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='system'
			enableSystem={true}
			enableColorScheme={false}
			themes={['system', 'light', 'dark']}
		>
			{children}
		</NextThemesProvider>
	)
}
