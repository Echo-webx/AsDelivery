import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeUserUpdate } from '@/types/user.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { addressService } from '@/services/address.service'

type Mutate = {
	id: string
	address: TypeUserUpdate
}

export function useAddressUpdate() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update_address_dashboard'],
		mutationFn: async (data: Mutate) => {
			await addressService.update(data.id, data.address)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_address_dashboard']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
