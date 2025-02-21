import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import type { TypeLogin } from '@/types/auth.types'

import { MAIN_PAGES } from '@/config/pages-url.config'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { authService } from '@/services/auth.service'

export function useLogin() {
	const { toast } = useToast()

	const { push } = useRouter()
	const { mutate, isPending } = useMutation({
		mutationKey: ['login'],
		mutationFn: async (data: TypeLogin) => {
			await authService.login(data)
		},
		onSuccess: async () => {
			toast.success('Успешно авторизован!')
			push(MAIN_PAGES.HOME)
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
