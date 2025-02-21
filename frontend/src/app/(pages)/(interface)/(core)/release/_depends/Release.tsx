'use client'

import { useState } from 'react'

import { EnumUserRole } from '@/types/user.types'

import { useProfileStore } from '@/store/useProfileStore'

import { getToday } from '@/utils/dateHelpers'

import styles from './Release.module.scss'
import { SelectDefault } from './features/SelectDefault'
import { SelectRoot } from './features/SelectRoot'
import { TotalRelease } from './widgets/release/TotalRelease'
import { TotalReport } from './widgets/report/TotalReport'

export type ReleaseGroup = 'report' | 'release'
export type SettingsSelect = 'standard' | 'extended'

export function Release() {
	const [activeGroup, setActiveGroup] = useState<ReleaseGroup>('release')
	const [isSetSelect, setIsSetSelect] = useState<SettingsSelect>('standard')
	const [date, setDate] = useState(getToday())
	const [dateTo, setDateTo] = useState<string | null>(null)
	const [index, setIndex] = useState('all')

	const { data } = useProfileStore()

	return (
		<div className={styles.main}>
			<div className={styles.buttons}>
				<button
					onClick={() => setActiveGroup('report')}
					className={activeGroup === 'report' ? styles.active : ''}
				>
					Отчет/Сводка
				</button>
				<button
					onClick={() => setActiveGroup('release')}
					className={activeGroup === 'release' ? styles.active : ''}
				>
					Реализации
				</button>
			</div>
			{data?.role !== EnumUserRole.default ? (
				<SelectRoot
					isSetSelect={isSetSelect}
					setIsSetSelect={setIsSetSelect}
					date={date}
					setDate={setDate}
					dateTo={dateTo}
					setDateTo={setDateTo}
					index={index}
					setIndex={setIndex}
				/>
			) : (
				<SelectDefault
					isSetSelect={isSetSelect}
					setIsSetSelect={setIsSetSelect}
					date={date}
					setDate={setDate}
					dateTo={dateTo}
					setDateTo={setDateTo}
				/>
			)}
			{activeGroup === 'report' && (
				<TotalReport
					date={date}
					dateTo={dateTo}
					index={index}
				/>
			)}
			{activeGroup === 'release' && (
				<TotalRelease
					date={date}
					dateTo={dateTo}
					index={index}
				/>
			)}
		</div>
	)
}
