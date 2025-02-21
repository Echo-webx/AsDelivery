import { useMutation, useQueryClient } from '@tanstack/react-query'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { addressService } from '@/services/address.service'

export function useAddressDelete() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['delete_address_dashboard'],
		mutationFn: async (id: string) => {
			await addressService.delete(id)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_address_dashboard']
			})
			toast.success('Успешно удален!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
