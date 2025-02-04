import { useQuery } from '@tanstack/react-query'

import { addressService } from '@/services/address.service'

export function useAddress(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_address', page, limit, search],
		queryFn: () => addressService.getForUser({ page, limit, search })
	})

	return {
		data: data?.data.address,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
