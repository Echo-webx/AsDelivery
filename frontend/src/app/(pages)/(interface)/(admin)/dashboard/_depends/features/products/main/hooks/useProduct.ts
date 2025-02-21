import { useQuery } from '@tanstack/react-query'

import { productService } from '@/services/product.service'

export function useProducts(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_products_dashboard', page, limit, search],
		queryFn: async () => await productService.getAll({ page, limit, search }),
		gcTime: 0
	})

	return {
		data: data?.data.products,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isSuccess,
		isFetching,
		refetch
	}
}
