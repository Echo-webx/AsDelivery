import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReset } from 'react-hook-form'

import type { TypeProductCategoryCreate } from '@/types/product-category.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { productCategoryService } from '@/services/product-category.service'

interface Props {
	reset: UseFormReset<TypeProductCategoryCreate>
}

export function useCategoryCreate({ reset }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['create_product_category_dashboard'],
		mutationFn: async (data: TypeProductCategoryCreate) => {
			await productCategoryService.create(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_product_categories_dashboard']
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
