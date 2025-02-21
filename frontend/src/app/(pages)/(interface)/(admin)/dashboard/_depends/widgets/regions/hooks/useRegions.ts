import { useQuery } from '@tanstack/react-query'

import { regionService } from '@/services/region.service'

export function useRegions(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_regions_dashboard', page, limit, search],
		queryFn: () => regionService.getAll({ page, limit, search }),
		gcTime: 0
	})

	return {
		data: data?.data.regions,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isSuccess,
		isFetching,
		refetch
	}
}
