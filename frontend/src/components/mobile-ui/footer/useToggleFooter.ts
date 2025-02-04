import { useState } from 'react'

export function useToggleFooter() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isAnimMenu, setIsAnimMenu] = useState(false)

	const toggleMenu = (type: boolean) => {
		if (type === false) {
			setIsAnimMenu(true)
			setTimeout(() => {
				setIsMenuOpen(false)
				setIsAnimMenu(false)
			}, 200)
		} else {
			setIsMenuOpen(true)
		}
	}

	return { isMenuOpen, isAnimMenu, toggleMenu }
}
