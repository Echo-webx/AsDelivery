import type { Metadata } from 'next'

import { Auth } from './_depends/Auth'

export const metadata: Metadata = {
	title: '| Авторизация'
}

export default function AuthPage() {
	return <Auth />
}
