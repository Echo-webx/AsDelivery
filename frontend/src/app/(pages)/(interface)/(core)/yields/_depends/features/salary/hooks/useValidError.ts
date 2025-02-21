import type { ButtonSalary } from '../../../widgets/salary/Salary'
import type { NewSalary } from '../Weekday'

interface Props {
	salaries: NewSalary[]
	styles: {
		readonly [key: string]: string
	}
}

export function useValidError({ salaries, styles }: Props) {
	const validationErrors = salaries.map(item => ({
		id: item.id === null || item.id === '',
		wages: item.wages === null || item.wages <= 0,
		weekday: item.weekday
	}))

	const getFieldError = (
		weekday: ButtonSalary,
		index: number,
		tag: 'id' | 'wages'
	) => {
		const filteredErrors = validationErrors.filter(
			error => error.weekday === weekday
		)
		const error = filteredErrors[index]
		if (error?.id && tag === 'id') return styles.warn
		if (error?.wages && tag === 'wages') return styles.warn
	}

	const validateForm = (weekday?: ButtonSalary) => {
		const errorsToCheck = weekday
			? validationErrors.filter(error => error.weekday === weekday)
			: validationErrors
		return errorsToCheck.every(error => !error.id && !error.wages)
	}

	const hasDuplicateIds = (weekday?: ButtonSalary) => {
		const idsCountByDay = new Map<ButtonSalary, Map<string, number>>()

		for (const item of salaries) {
			if (!idsCountByDay.has(item.weekday))
				idsCountByDay.set(item.weekday, new Map())

			const dayMap = idsCountByDay.get(item.weekday)!
			dayMap.set(item.id, (dayMap.get(item.id) || 0) + 1)

			if (dayMap.get(item.id)! > 1 && (!weekday || weekday === item.weekday))
				return true
		}
		return false
	}

	const checkDuplicateClass = (id: string, weekday: ButtonSalary) => {
		return salaries.filter(item => item.id === id && item.weekday === weekday)
			.length > 1
			? styles.warn
			: ''
	}

	const getButtonError = (weekday: ButtonSalary) => {
		const hasErrors = !validateForm(weekday) || hasDuplicateIds(weekday)
		return hasErrors ? styles.warn : ''
	}

	return {
		getFieldError,
		validateForm,
		hasDuplicateIds,
		checkDuplicateClass,
		getButtonError
	}
}
