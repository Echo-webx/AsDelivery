import type { Metadata } from 'next'

import { Release } from './_depends/Release'

export const metadata: Metadata = {
	title: '| Реализации'
}

export default function ReleasePage() {
	return <Release />
}
