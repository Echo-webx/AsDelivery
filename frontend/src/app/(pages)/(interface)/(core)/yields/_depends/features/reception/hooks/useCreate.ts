import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeProductReceptionCreate } from '@/types/reception.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { receptionService } from '@/services/reception.service'

interface Props {
	clearProduct: () => void
}

export function useReceptionCreate({ clearProduct }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['create_reception'],
		mutationFn: async (data: TypeProductReceptionCreate) => {
			await receptionService.create(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_reception']
			})
			clearProduct()
			toast.success('Успешно создан!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
