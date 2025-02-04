import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReset } from 'react-hook-form'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { userService } from '@/services/user.service'

interface Props {
	reset: UseFormReset<any>
}

type Mutate = {
	id: string
	regionId: string
}

export function useRegionAdd({ reset }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['add_user_region'],
		mutationFn: async (data: Mutate) => {
			await userService.addUserRegion(data.id, data.regionId)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_user_regions']
			})
			reset()
			toast.success('Успешно добавлен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
