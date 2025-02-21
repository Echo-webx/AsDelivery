import type { Metadata } from 'next'

import { ReceptionItem } from './_depends/ReceptionItem'

export const metadata: Metadata = {
	title: '| Накладная прихода товара'
}

export default function YieldsPage() {
	return <ReceptionItem />
}
