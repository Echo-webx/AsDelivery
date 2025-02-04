import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeProductReceptionPositionUpdate } from '@/types/reception.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { receptionService } from '@/services/reception.service'

interface Mutate {
	id: string
	reception: TypeProductReceptionPositionUpdate
}

export function useUpdateReception() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['update_reception'],
		mutationFn: async (data: Mutate) => {
			await receptionService.update(data.id, data.reception)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_reception_item']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
