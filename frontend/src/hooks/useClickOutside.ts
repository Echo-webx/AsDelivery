import { type RefObject, useEffect } from 'react'

export function useClickOutside(
	ref: RefObject<HTMLElement | null>,
	callback: () => void,
	disabled: boolean = false
) {
	const handleClickOutside = (event: MouseEvent) => {
		if (!ref.current?.contains(event.target as Node)) {
			callback()
		}
	}

	useEffect(() => {
		if (!ref.current || disabled) return

		const controller = new AbortController()
		const signal = { signal: controller.signal }

		document.addEventListener('click', handleClickOutside, signal)

		return () => controller.abort()
	}, [ref, callback, disabled])
}
