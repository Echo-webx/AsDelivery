import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeUserUpdate } from '@/types/user.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { regionService } from '@/services/region.service'

type Mutate = {
	id: string
	region: TypeUserUpdate
}

export function useRegionUpdate() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update_region_dashboard'],
		mutationFn: async (data: Mutate) => {
			await regionService.update(data.id, data.region)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_regions_dashboard']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
