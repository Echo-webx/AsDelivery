import type { NewProduct } from '../Products'

interface Props {
	newProducts: NewProduct[]
	styles: {
		readonly [key: string]: string
	}
}

export function useValidError({ newProducts, styles }: Props) {
	const validationErrors = newProducts.map(item => ({
		id: item.id === null || item.id === '',
		count: item.count === null || item.count <= 0
	}))

	const getFieldError = (index: number, tag: 'id' | 'count') => {
		const errors = validationErrors[index]
		if (errors.id && tag === 'id') return styles.warn
		if (errors.count && tag === 'count') return styles.warn
	}

	const validateForm = () => {
		return validationErrors.every(error => !error.id && !error.count)
	}

	const hasDuplicateIds = () => {
		const ids = newProducts.map(item => item.id)
		return ids.some((id, index) => ids.indexOf(id) !== index)
	}

	const checkDuplicateClass = (id: string) => {
		return newProducts.filter(item => item.id === id).length > 1
			? styles.warn
			: ''
	}

	return { getFieldError, validateForm, hasDuplicateIds, checkDuplicateClass }
}
