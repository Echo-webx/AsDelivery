import type { Metadata } from 'next'

import { Manage } from './_depends/Manage'

export const metadata: Metadata = {
	title: '| Контроль'
}

export default function ManagePage() {
	return <Manage />
}
