import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeUserUpdate } from '@/types/user.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { userService } from '@/services/user.service'

type Mutate = {
	id: string
	user: TypeUserUpdate
}

export function useUserUpdate() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update_user_dashboard'],
		mutationFn: async (data: Mutate) => {
			await userService.update(data.id, data.user)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_users_dashboard']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
