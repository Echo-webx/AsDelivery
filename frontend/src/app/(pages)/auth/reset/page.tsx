import type { Metadata } from 'next'

import { PreReset } from './_depends/PreReset'

export const metadata: Metadata = {
	title: '| Сброс пароля'
}

export default function AuthPage() {
	return <PreReset />
}
