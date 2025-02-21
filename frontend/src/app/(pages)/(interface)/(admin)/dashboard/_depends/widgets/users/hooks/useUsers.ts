import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

export function useUsers(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_users_dashboard', page, limit, search],
		queryFn: () => userService.getUsers({ page, limit, search }),
		gcTime: 0
	})

	return {
		data: data?.data.users,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
