import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EnumProductReceptionMarking } from '@/types/reception.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { receptionService } from '@/services/reception.service'

interface Mutate {
	id: string
	marking: EnumProductReceptionMarking
}

export function useMarkingReception() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['marking_reception'],
		mutationFn: async (data: Mutate) => {
			await receptionService.marking(data.id, data.marking)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['get_reception_item']
			})
			toast.success('Изменения внесены!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
