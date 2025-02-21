import { useQuery } from '@tanstack/react-query'

import type { TypeSearchIndex } from '@/types/root.types'

import { releaseStatisticsService } from '@/services/release-statistics.service'

export function useReleaseStatisticsOneAddress(
	query: TypeSearchIndex,
	id: string
) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: [
			'get_statistics_one_address',
			query.date,
			query.dateTo,
			query.index,
			id
		],
		queryFn: () => releaseStatisticsService.getOneAddress(id, query),
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
