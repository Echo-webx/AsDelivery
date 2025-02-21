import { useEffect, useState } from 'react'
import t, { type ToastOptions, useToasterStore } from 'react-hot-toast'

export default function useToast() {
	const [toastLimit, setToastLimit] = useState(1)

	const { toasts } = useToasterStore()

	useEffect(() => {
		const visibleToasts = toasts.filter(tt => tt.visible)

		if (visibleToasts.length > toastLimit)
			visibleToasts.slice(toastLimit).forEach(tt => t.remove(tt.id))
	}, [toasts, toastLimit])

	const toast = {
		...t,
		setLimit: setToastLimit,
		successClip: (message: string, options?: Omit<ToastOptions, 'id'>) => {
			t.success(message, { id: 'clip', ...options })
		},
		errorClip: (message: string, options?: Omit<ToastOptions, 'id'>) => {
			t.error(message, { id: 'clip', ...options })
		}
	}

	return { toast }
}
