import type { Metadata } from 'next'

import { Dashboard } from './_depends/Dashboard'

export const metadata: Metadata = {
	title: '| Панель управления'
}

export default function DashboardPage() {
	return <Dashboard />
}
