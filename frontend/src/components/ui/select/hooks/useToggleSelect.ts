import { useState } from 'react'

export function useToggleSelect() {
	const [isSelectOpen, setIsSelectOpen] = useState(false)
	const [isAnimSelect, setIsAnimSelect] = useState(false)

	const toggleSelect = (type: boolean) => {
		if (type === false) {
			setIsAnimSelect(true)
			setTimeout(() => {
				setIsSelectOpen(false)
				setIsAnimSelect(false)
			}, 200)
		} else {
			setIsSelectOpen(true)
		}
	}

	return {
		toggleSelect,
		isSelectOpen,
		isAnimSelect
	}
}
