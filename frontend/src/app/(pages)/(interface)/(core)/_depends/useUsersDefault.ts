import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

export function useUsersDefault(page: number, limit: number, search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_users_default', page, limit, search],
		queryFn: () => userService.getUsersDefault({ page, limit, search })
	})

	return {
		data: data?.data.users,
		totalCount: data?.data.totalCount,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
