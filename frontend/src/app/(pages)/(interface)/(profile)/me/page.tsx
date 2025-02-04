import type { Metadata } from 'next'

import { Profile } from './_depends/Profile'

export const metadata: Metadata = {
	title: '| Профиль'
}

export default function ProfilePage() {
	return <Profile />
}
