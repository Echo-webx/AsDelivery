import { useQuery } from '@tanstack/react-query'

import { releaseStatisticsService } from '@/services/release-statistics.service'

export function useAllStatistics() {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_all_statistics'],
		queryFn: () => releaseStatisticsService.getAll(),
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
