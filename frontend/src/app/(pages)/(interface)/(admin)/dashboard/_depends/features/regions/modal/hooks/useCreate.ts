import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReset } from 'react-hook-form'

import type { TypeRegionCreate } from '@/types/regions.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { regionService } from '@/services/region.service'

interface Props {
	reset: UseFormReset<TypeRegionCreate>
}

export function useRegionCreate({ reset }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['create_region_dashboard'],
		mutationFn: async (data: TypeRegionCreate) => {
			await regionService.create(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_regions_dashboard']
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
