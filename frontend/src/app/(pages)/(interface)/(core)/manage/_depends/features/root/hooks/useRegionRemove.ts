import { useMutation, useQueryClient } from '@tanstack/react-query'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { userService } from '@/services/user.service'

interface MutateProps {
	id: string
	regionId: string
}

export function useRegionRemove() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['remove_user_region'],
		mutationFn: async (data: MutateProps) => {
			await userService.deleteUserRegion(data.id, data.regionId)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_user_regions']
			})
			toast.success('Успешно удален!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
