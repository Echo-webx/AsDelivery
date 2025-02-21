import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react'

import { EnumSalaryWeekday } from '@/types/salary.types'

import type { ButtonSalary } from '../../widgets/salary/Salary'

import styles from './ButtonList.module.scss'
import type { NewSalary } from './Weekday'
import { useValidError } from './hooks/useValidError'

interface Props {
	activeButton: ButtonSalary
	setActiveButton: Dispatch<SetStateAction<ButtonSalary>>
	salaries: NewSalary[]
}
export function ButtonListSalary({
	activeButton,
	setActiveButton,
	salaries
}: Props) {
	const buttonListRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const activeButton = buttonListRef.current?.querySelector(
			`.${styles.active}`
		)
		if (activeButton) {
			activeButton.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center'
			})
		}
	}, [activeButton])

	const { getButtonError } = useValidError({ salaries, styles })

	return (
		<div
			ref={buttonListRef}
			className={styles.button_list}
		>
			<button
				onClick={() => setActiveButton('month')}
				className={`${activeButton === 'month' ? styles.active : ''}`}
			>
				За месяц
			</button>
			<button
				onClick={() => setActiveButton('week')}
				className={`${activeButton === 'week' ? styles.active : ''}`}
			>
				За неделю
			</button>
			<button
				onClick={() => setActiveButton(EnumSalaryWeekday.monday)}
				className={`${
					activeButton === EnumSalaryWeekday.monday
						? styles.active
						: getButtonError(EnumSalaryWeekday.monday)
							? styles.warn
							: ''
				}`}
			>
				Понедельник
			</button>
			<button
				onClick={() => setActiveButton(EnumSalaryWeekday.tuesday)}
				className={`${
					activeButton === EnumSalaryWeekday.tuesday
						? styles.active
						: getButtonError(EnumSalaryWeekday.tuesday)
							? styles.warn
							: ''
				}`}
			>
				Вторник
			</button>
			<button
				onClick={() => setActiveButton(EnumSalaryWeekday.wednesday)}
				className={`${
					activeButton === EnumSalaryWeekday.wednesday
						? styles.active
						: getButtonError(EnumSalaryWeekday.wednesday)
							? styles.warn
							: ''
				}`}
			>
				Среда
			</button>
			<button
				onClick={() => setActiveButton(EnumSalaryWeekday.thursday)}
				className={`${
					activeButton === EnumSalaryWeekday.thursday
						? styles.active
						: getButtonError(EnumSalaryWeekday.thursday)
							? styles.warn
							: ''
				}`}
			>
				Четверг
			</button>
			<button
				onClick={() => setActiveButton(EnumSalaryWeekday.friday)}
				className={`${
					activeButton === EnumSalaryWeekday.friday
						? styles.active
						: getButtonError(EnumSalaryWeekday.friday)
							? styles.warn
							: ''
				}`}
			>
				Пятница
			</button>
			<button
				onClick={() => setActiveButton(EnumSalaryWeekday.saturday)}
				className={`${
					activeButton === EnumSalaryWeekday.saturday
						? styles.active
						: getButtonError(EnumSalaryWeekday.saturday)
							? styles.warn
							: ''
				}`}
			>
				Суббота
			</button>
			<button
				onClick={() => setActiveButton(EnumSalaryWeekday.sunday)}
				className={`${
					activeButton === EnumSalaryWeekday.sunday
						? styles.active
						: getButtonError(EnumSalaryWeekday.sunday)
							? styles.warn
							: ''
				}`}
			>
				Воскресенье
			</button>
		</div>
	)
}
