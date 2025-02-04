'use client'

import { EnumUserRole } from '@/types/user.types'

import { useProfileStore } from '@/store/useProfileStore'

import styles from './Home.module.scss'
import { HomeDefault } from './widgets/default/HomeDefault'
import { RootDefault } from './widgets/root/RootDefault'

export function Home() {
	const { data } = useProfileStore()

	return (
		<div className={styles.main}>
			{data?.role !== EnumUserRole.root && <HomeDefault />}
			{data?.role === EnumUserRole.root && <RootDefault />}
		</div>
	)
}
