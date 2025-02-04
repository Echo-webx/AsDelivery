import { useTheme } from 'next-themes'
import { useState } from 'react'

export function useToggleNavbar() {
	const [isThemeOpen, setIsThemeOpen] = useState(false)
	const [isAnimTheme, setIsAnimTheme] = useState(false)

	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [isAnimSearch, setIsAnimSearch] = useState(false)

	const [isRegionOpen, setIsRegionOpen] = useState(false)
	const [isAnimRegion, setIsAnimRegion] = useState(false)

	const { theme, setTheme } = useTheme()

	const toggleSearch = (type: boolean) => {
		if (type === false) {
			setIsAnimSearch(true)
			setTimeout(() => {
				setIsSearchOpen(false)
				setIsAnimSearch(false)
			}, 200)
		} else {
			setIsSearchOpen(true)
		}
	}

	const toggleTheme = (type: boolean, mode?: string) => {
		if (mode) {
			setTheme(mode)
		}
		if (type === false) {
			setIsAnimTheme(true)
			setTimeout(() => {
				setIsThemeOpen(false)
				setIsAnimTheme(false)
			}, 200)
		} else {
			setIsThemeOpen(true)
		}
	}

	const toggleRegion = (type: boolean) => {
		if (type === false) {
			setIsAnimRegion(true)
			setTimeout(() => {
				setIsRegionOpen(false)
				setIsAnimRegion(false)
			}, 200)
		} else {
			setIsRegionOpen(true)
		}
	}

	return {
		theme,
		toggleSearch,
		toggleTheme,
		toggleRegion,
		isSearchOpen,
		isThemeOpen,
		isRegionOpen,
		isAnimSearch,
		isAnimTheme,
		isAnimRegion
	}
}
