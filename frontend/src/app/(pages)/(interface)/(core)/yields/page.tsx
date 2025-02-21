import type { Metadata } from 'next'

import { Yields } from './_depends/Yields'

export const metadata: Metadata = {
	title: '| Отчетность'
}

export default function YieldsPage() {
	return <Yields />
}
