import type { Metadata } from 'next'

import type { IParams } from '@/types/page.types'

import { Reset } from './_depends/Reset'

type Props = IParams<{ token?: string }>

export const metadata: Metadata = {
	title: '| Сброс пароля'
}

export default async function AuthPage({ params }: Props) {
	const { token } = await params

	return <Reset token={token} />
}
