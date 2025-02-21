import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

export function useUserRegions(
	id: string,
	page: number,
	limit: number,
	search: string
) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_user_regions', id, page, limit, search],
		queryFn: () => userService.getUserRegions(id, { page, limit, search })
	})

	return {
		data: data?.data.regions,
		totalCount: data?.data.totalCount,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
