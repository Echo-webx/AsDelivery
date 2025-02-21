import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReset } from 'react-hook-form'

import type { TypeProductCreate } from '@/types/product.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { productService } from '@/services/product.service'

interface Props {
	reset: UseFormReset<TypeProductCreate>
}

export function useProductCreate({ reset }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['create_product_dashboard'],
		mutationFn: async (data: TypeProductCreate) => {
			await productService.create(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_products_dashboard']
			})
			reset()
			toast.success('Успешно создан!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
