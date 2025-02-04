import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

export function useUsersManager(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_users_manager', page, limit, search],
		queryFn: () => userService.getUsersManager({ page, limit, search })
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
