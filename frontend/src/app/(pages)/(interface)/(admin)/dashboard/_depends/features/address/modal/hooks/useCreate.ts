import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReset } from 'react-hook-form'

import type { TypeAddressCreate } from '@/types/address.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { addressService } from '@/services/address.service'

interface Props {
	reset: UseFormReset<TypeAddressCreate>
}

export function useAddressCreate({ reset }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['create_address_dashboard'],
		mutationFn: async (data: TypeAddressCreate) => {
			await addressService.create(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_address_dashboard']
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
