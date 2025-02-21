import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReset } from 'react-hook-form'

import type { TypeUserCreate } from '@/types/user.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { userService } from '@/services/user.service'

interface Props {
	reset: UseFormReset<TypeUserCreate>
}

export function useUserCreate({ reset }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['create_user_dashboard'],
		mutationFn: async (data: TypeUserCreate) => {
			await userService.create(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_users_dashboard']
			})
			reset()
			toast.success('Успешно создан!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
