import { useQuery } from '@tanstack/react-query'

import { workloadService } from '@/services/workload.service'

export function useWorkloadUser(id: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_workload_user', id],
		queryFn: () => workloadService.getUser(id),
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
