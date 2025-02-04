import { useQuery } from '@tanstack/react-query'

import { releaseService } from '@/services/release.service'

export function useReleaseItem(id: string) {
	const { data, isLoading, isFetching, isSuccess } = useQuery({
		queryKey: ['get_release_item', id],
		queryFn: () => releaseService.getOne(id),
		gcTime: 0
	})

	return {
		data: data?.data,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess
	}
}
