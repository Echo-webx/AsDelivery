import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeUserUpdate } from '@/types/user.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { productService } from '@/services/product.service'

type Mutate = {
	id: string
	product: TypeUserUpdate
}

export function useProductUpdate() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update_product_dashboard'],
		mutationFn: async (data: Mutate) => {
			await productService.update(data.id, data.product)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_products_dashboard']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
