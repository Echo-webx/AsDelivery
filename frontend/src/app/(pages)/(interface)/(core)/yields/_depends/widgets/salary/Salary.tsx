import { useState } from 'react'

import { EnumSalaryWeekday } from '@/types/salary.types'

import { ButtonListSalary } from '../../features/salary/ButtonList'
import { Statistics } from '../../features/salary/Statistics'
import { type NewSalary, Weekday } from '../../features/salary/Weekday'

import styles from './Salary.module.scss'

export type ButtonSalary = 'week' | 'month' | EnumSalaryWeekday

interface Props {
	week: string
}

export function Salary({ week }: Props) {
	const [activeButton, setActiveButton] = useState<ButtonSalary>('week')
	const [salaries, setSalaries] = useState<NewSalary[]>([])

	return (
		<>
			<ButtonListSalary
				activeButton={activeButton}
				setActiveButton={setActiveButton}
				salaries={salaries}
			/>
			<div className={styles.main}>
				{activeButton === 'week' ? (
					<Statistics
						week={week}
						group='week'
					/>
				) : activeButton === 'month' ? (
					<Statistics
						week={week}
						group='month'
					/>
				) : (
					<Weekday
						week={week}
						weekday={activeButton}
						salaries={salaries}
						setSalaries={setSalaries}
					/>
				)}
			</div>
		</>
	)
}
