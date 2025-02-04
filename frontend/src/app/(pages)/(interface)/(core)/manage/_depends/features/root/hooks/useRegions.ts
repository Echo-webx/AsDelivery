import { useQuery } from '@tanstack/react-query'

import { regionService } from '@/services/region.service'

export function useRegionsForUser(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_regions_for_user', page, limit, search],
		queryFn: () => regionService.getAll({ page, limit, search })
	})

	return {
		data: data?.data.regions,
		totalCount: data?.data.totalCount,
		isLoading,
		isSuccess,
		isFetching,
		refetch
	}
}
