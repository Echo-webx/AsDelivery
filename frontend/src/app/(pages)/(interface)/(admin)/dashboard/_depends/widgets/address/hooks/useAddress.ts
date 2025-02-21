import { useQuery } from '@tanstack/react-query'

import { addressService } from '@/services/address.service'

export function useAddress(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_address_dashboard', page, limit, search],
		queryFn: () => addressService.getAll({ page, limit, search }),
		gcTime: 0
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
