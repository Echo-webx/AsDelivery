import type { NewCreate } from '../modal/ModalCreate'

interface Props {
	newCreate: NewCreate[]
	styles: {
		readonly [key: string]: string
	}
}

export function useValidError({ newCreate, styles }: Props) {
	const validationErrors = newCreate.map(item => ({
		name: item.name === null || item.name === '',
		quantity: item.quantity === null || item.quantity <= 0,
		purchasePrice: item.purchasePrice === null || item.purchasePrice <= 0
	}))

	const getFieldError = (
		index: number,
		tag: 'name' | 'quantity' | 'purchasePrice'
	) => {
		const errors = validationErrors[index]
		if (errors.name && tag === 'name') return styles.warn
		if (errors.quantity && tag === 'quantity') return styles.warn
		if (errors.purchasePrice && tag === 'purchasePrice') return styles.warn
	}

	const validateForm = () => {
		return validationErrors.every(
			error => !error.name && !error.quantity && !error.purchasePrice
		)
	}

	const hasDuplicateName = () => {
		const names = newCreate.map(item => item.name)
		return names.some((name, index) => names.indexOf(name) !== index)
	}

	const checkDuplicateClass = (name: string) => {
		return newCreate.filter(item => item.name === name).length > 1
			? styles.warn
			: ''
	}

	return { getFieldError, validateForm, hasDuplicateName, checkDuplicateClass }
}
