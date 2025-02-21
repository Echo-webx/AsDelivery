import { useQuery } from '@tanstack/react-query'

import { workloadService } from '@/services/workload.service'

export function useWorkload(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_workload', page, limit, search],
		queryFn: () => workloadService.getAll({ page, limit, search })
	})

	return {
		data: data?.data.items,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
