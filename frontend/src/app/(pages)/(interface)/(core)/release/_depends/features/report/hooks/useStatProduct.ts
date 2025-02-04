import { useQuery } from '@tanstack/react-query'

import type { TypeSearchIndex } from '@/types/root.types'

import { releaseStatisticsService } from '@/services/release-statistics.service'

export function useReleaseStatisticsProduct(query: TypeSearchIndex) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_statistics_product', query.date, query.dateTo, query.index],
		queryFn: () => releaseStatisticsService.getProduct(query),
		gcTime: 0
	})

	return {
		data: data?.data,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
