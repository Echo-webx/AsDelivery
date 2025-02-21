import { useMutation } from '@tanstack/react-query'

import type { TypeEmail } from '@/types/auth.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { authService } from '@/services/auth.service'

export function usePreReset() {
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['pre-reset'],
		mutationFn: async (data: TypeEmail) => {
			await authService.preReset(data)
		},
		onSuccess: async () => {
			toast.success('Успешно отправлено!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
