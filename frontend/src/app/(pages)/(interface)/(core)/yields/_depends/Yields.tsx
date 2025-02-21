'use client'

import { useState } from 'react'

import { getCurrentWeek, getToday } from '@/utils/dateHelpers'

import styles from './Yields.module.scss'
import { SelectYields } from './features/SelectYields'
import { TotalReception } from './widgets/reception/TotalReception'
import { Salary } from './widgets/salary/Salary'

export type YieldsGroup = 'salary' | 'reception'

export function Yields() {
	const [activeGroup, setActiveGroup] = useState<YieldsGroup>('reception')
	const [week, setWeek] = useState(getCurrentWeek())
	const [date, setDate] = useState(getToday())
	const [dateTo, setDateTo] = useState<string | null>(null)

	return (
		<div className={styles.main}>
			<div className={styles.buttons}>
				<button
					onClick={() => setActiveGroup('salary')}
					className={activeGroup === 'salary' ? styles.active : ''}
				>
					Заработная плата
				</button>
				<button
					onClick={() => setActiveGroup('reception')}
					className={activeGroup === 'reception' ? styles.active : ''}
				>
					Поставка
				</button>
			</div>
			<SelectYields
				activeGroup={activeGroup}
				week={week}
				setWeek={setWeek}
				date={date}
				setDate={setDate}
				dateTo={dateTo}
				setDateTo={setDateTo}
			/>
			{activeGroup === 'salary' && <Salary week={week} />}
			{activeGroup === 'reception' && (
				<TotalReception
					date={date}
					dateTo={dateTo}
				/>
			)}
		</div>
	)
}
