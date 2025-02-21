import type { Dispatch, SetStateAction } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import type { OptionDataProps } from '../element/Option'

interface Props {
	selectedValues: OptionDataProps[]
	setSelectedValues: Dispatch<SetStateAction<OptionDataProps[]>>
	toggleSelect: (type: boolean) => void
	name?: string
	setValue?: UseFormSetValue<any>
	multiple?: boolean
}

export function useClickSelect({
	selectedValues,
	setSelectedValues,
	toggleSelect,
	name,
	setValue,
	multiple
}: Props) {
	const handleOptionClick = (data: OptionDataProps) => {
		const exists = selectedValues.some(val => val.value === data.value)
		const updatedValues = multiple
			? exists
				? selectedValues.filter(val => val.value !== data.value)
				: [...selectedValues, data]
			: [data]

		setSelectedValues(updatedValues)
		if (!multiple) toggleSelect(false)

		if (setValue && name) {
			setValue(
				name,
				multiple
					? updatedValues.map(val => val.value)
					: updatedValues[0]?.value,
				{
					shouldValidate: true
				}
			)
		}
	}

	// Обработка удаления
	const handleRemoveValue = (valueToRemove: string | number) => {
		const updatedValues = selectedValues.filter(
			val => val.value !== valueToRemove
		)
		setSelectedValues(updatedValues)

		if (setValue && name) {
			setValue(
				name,
				updatedValues.map(val => val.value),
				{ shouldValidate: true }
			)
		}
	}

	return {
		handleOptionClick,
		handleRemoveValue
	}
}
