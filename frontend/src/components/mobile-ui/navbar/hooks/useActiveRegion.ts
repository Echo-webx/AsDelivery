import { useMutation, useQueryClient } from '@tanstack/react-query'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { userService } from '@/services/user.service'

export function useActiveRegion() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['active_region'],
		mutationFn: async (id: string) => {
			await userService.activeRegion(id)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries()
			toast.success('Успешно активирован!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
