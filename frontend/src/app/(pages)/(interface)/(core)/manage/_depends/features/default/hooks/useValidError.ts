import type { NewCreate } from '../FormCreate'

interface Props {
	newCreate: NewCreate[]
	styles: {
		readonly [key: string]: string
	}
}

export function useValidError({ newCreate, styles }: Props) {
	const validationErrors = newCreate.map(item => ({
		id: item.id === null || item.id === '',
		quantity:
			item.quantitySale === null ||
			item.quantitySwap === null ||
			item.quantityBonus === null ||
			!(
				item.quantitySale > 0 ||
				item.quantitySwap > 0 ||
				item.quantityBonus > 0
			),
		quantitySale: item.quantitySale === null || item.quantitySale < 0,
		quantitySwap: item.quantitySwap === null || item.quantitySwap < 0,
		quantityBonus: item.quantityBonus === null || item.quantityBonus < 0
	}))

	const getFieldError = (
		index: number,
		tag: 'id' | 'quantity' | 'quantitySale' | 'quantitySwap' | 'quantityBonus'
	) => {
		const errors = validationErrors[index]
		if (errors.id && tag === 'id') return styles.warn
		if (errors.quantity && tag === 'quantity') return styles.warn
		if (errors.quantitySale && tag === 'quantitySale') return styles.warn
		if (errors.quantitySwap && tag === 'quantitySwap') return styles.warn
		if (errors.quantityBonus && tag === 'quantityBonus') return styles.warn
	}

	const validateForm = () => {
		return validationErrors.every(error => !error.id && !error.quantity)
	}

	const hasDuplicateIds = () => {
		const ids = newCreate.map(item => item.id)
		return ids.some((id, index) => ids.indexOf(id) !== index)
	}

	const checkDuplicateClass = (id: string) => {
		return newCreate.filter(item => item.id === id).length > 1
			? styles.warn
			: ''
	}

	return { getFieldError, validateForm, hasDuplicateIds, checkDuplicateClass }
}
