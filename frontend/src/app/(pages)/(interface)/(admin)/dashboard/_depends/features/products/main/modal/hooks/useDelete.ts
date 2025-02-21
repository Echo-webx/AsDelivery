import { useMutation, useQueryClient } from '@tanstack/react-query'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { productService } from '@/services/product.service'

export function useProductDelete() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['delete_product_dashboard'],
		mutationFn: async (id: string) => {
			await productService.delete(id)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_products_dashboard']
			})
			toast.success('Успешно удален!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
