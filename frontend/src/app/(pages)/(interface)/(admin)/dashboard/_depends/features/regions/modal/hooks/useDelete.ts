import { useMutation, useQueryClient } from '@tanstack/react-query'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { regionService } from '@/services/region.service'

export function useRegionDelete() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['delete_region_dashboard'],
		mutationFn: async (id: string) => {
			await regionService.delete(id)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_regions_dashboard']
			})
			toast.success('Успешно удален!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
