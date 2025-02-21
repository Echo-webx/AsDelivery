import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import type { TypeReset } from '@/types/auth.types'

import { MAIN_PAGES } from '@/config/pages-url.config'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { authService } from '@/services/auth.service'

export function useReset() {
	const { toast } = useToast()

	const { push } = useRouter()
	const { mutate, isPending } = useMutation({
		mutationKey: ['pre-reset'],
		mutationFn: async (data: TypeReset) => {
			await authService.reset(data)
		},
		onSuccess: async () => {
			toast.success('Успешно изменен!')
			push(MAIN_PAGES.AUTH)
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
