import { useQuery } from '@tanstack/react-query'

import { searchService } from '@/services/search.service'

export function useSearchNavbar(search: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_search', search],
		queryFn: () => searchService.get(search),
		gcTime: 0
	})

	return {
		data: data?.data,
		status: data?.status,
		isLoading,
		isSuccess,
		isFetching,
		refetch
	}
}
