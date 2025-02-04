import type { Metadata } from 'next'

import { Reset } from './_depends/Reset'

export const metadata: Metadata = {
	title: '| Сброс пароля'
}

export default function AuthPage({ params }: { params: { token: string } }) {
	return <Reset token={params.token} />
}
