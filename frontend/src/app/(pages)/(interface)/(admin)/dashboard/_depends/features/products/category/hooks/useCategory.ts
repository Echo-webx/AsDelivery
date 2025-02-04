import { useQuery } from '@tanstack/react-query'

import { productCategoryService } from '@/services/product-category.service'

export function useCategory(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_product_categories_dashboard', page, limit, search],
		queryFn: async () =>
			await productCategoryService.getAll({ page, limit, search }),
		gcTime: 0
	})

	return {
		data: data?.data.productCategories,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isSuccess,
		isFetching,
		refetch
	}
}
