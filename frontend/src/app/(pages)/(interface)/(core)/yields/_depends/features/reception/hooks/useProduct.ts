import { useQuery } from '@tanstack/react-query'

import { receptionService } from '@/services/reception.service'

export function useProductReception(
	page: number,
	limit: number,
	search: string
) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_product_reception', page, limit, search],
		queryFn: () => receptionService.getProduct({ page, limit, search })
	})

	return {
		data: data?.data.products,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
