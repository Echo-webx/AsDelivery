import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeProductCategoryUpdate } from '@/types/product-category.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { productCategoryService } from '@/services/product-category.service'

type Mutate = {
	id: string
	productCategory: TypeProductCategoryUpdate
}

export function useCategoryUpdate() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update_product_category_dashboard'],
		mutationFn: async (data: Mutate) => {
			await productCategoryService.update(data.id, data.productCategory)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_product_categories_dashboard']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
