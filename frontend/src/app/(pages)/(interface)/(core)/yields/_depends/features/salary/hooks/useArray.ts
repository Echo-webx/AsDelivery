import type { Dispatch, SetStateAction } from 'react'
import { v4 as uuidV4 } from 'uuid'

import { EnumSalaryWeekday } from '@/types/salary.types'

import type { NewSalary } from '../Weekday'

interface Props {
	weekday: EnumSalaryWeekday
	salaries: NewSalary[]
	setSalaries: Dispatch<SetStateAction<NewSalary[]>>
}

export function useArray({ weekday, salaries, setSalaries }: Props) {
	const addSalary = () => {
		setSalaries([
			...salaries,
			{
				key: uuidV4(),
				id: '',
				linkId: '',
				weekday,
				name: '',
				wages: 0
			}
		])
	}
	const handleSalaryChange = <K extends keyof NewSalary>(
		key: string,
		field: K,
		value: NewSalary[K]
	) => {
		setSalaries(prevSalaries =>
			prevSalaries.map(item =>
				item.key === key ? { ...item, [field]: value } : item
			)
		)
	}

	const handleDeleteSalary = (key: string) => {
		setSalaries(salaries.filter(i => i.key !== key))
	}

	return { addSalary, handleSalaryChange, handleDeleteSalary }
}
