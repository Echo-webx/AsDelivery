import { useMutation, useQueryClient } from '@tanstack/react-query'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { productCategoryService } from '@/services/product-category.service'

export function useCategoryDelete() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['delete_product_category_dashboard'],
		mutationFn: async (id: string) => {
			await productCategoryService.delete(id)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_product_categories_dashboard']
			})
			toast.success('Успешно удален!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
