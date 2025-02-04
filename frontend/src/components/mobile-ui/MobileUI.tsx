'use client'

import type { PropsWithChildren } from 'react'

import { Loader } from '@/components/loader/Loader'

import { EnumUserRole } from '@/types/user.types'

import { useProfileStore } from '@/store/useProfileStore'

import styles from './MobileUI.module.scss'
import { Footer } from './footer/Footer'
import { Navbar } from './navbar/Navbar'

export function MobileUI({ children }: PropsWithChildren<unknown>) {
	const { data, isLoading, isSuccess } = useProfileStore()
	return (
		<>
			<Navbar />
			<main className={styles.main}>
				{isLoading ? (
					<Loader
						isLoading={isLoading}
						type='pulsing'
						box
					/>
				) : isSuccess && data?.role ? (
					data.role !== EnumUserRole.root && !data.activeRegionId ? (
						<div className={styles.not_found}>
							<p>Для начала необходимо активировать регион</p>
						</div>
					) : (
						children
					)
				) : (
					<div className={styles.not_success}>
						<p>Ошибка загрузки</p>
					</div>
				)}
			</main>
			<Footer />
		</>
	)
}
