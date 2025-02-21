import type { Metadata } from 'next'

import { ReleaseItem } from './_depends/ReleaseItem'

export const metadata: Metadata = {
	title: '| Накладная на отпуск товара'
}

export default function ReleaseItemPage() {
	return <ReleaseItem />
}
