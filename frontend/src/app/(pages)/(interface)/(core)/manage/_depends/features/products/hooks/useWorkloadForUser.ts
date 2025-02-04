import { useQuery } from '@tanstack/react-query'

import { workloadService } from '@/services/workload.service'

export function useWorkloadForUser(
	id: string,
	page: number,
	limit: number,
	search: string
) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_workload_for_user', id, page, limit, search],
		queryFn: () => workloadService.getForUser(id, { page, limit, search }),
		gcTime: 0
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
