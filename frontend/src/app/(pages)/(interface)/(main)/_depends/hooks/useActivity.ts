import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

export function useActivity() {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_activity'],
		queryFn: () => userService.getMap(),
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
