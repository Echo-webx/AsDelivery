import { useQuery } from '@tanstack/react-query'

import type { TypeSearch, TypeSearchIndex } from '@/types/root.types'

import { releaseService } from '@/services/release.service'

export function useRelease(query: TypeSearch & TypeSearchIndex) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: [
			'get_release',
			query.page,
			query.limit,
			query.search,
			query.date,
			query.dateTo,
			query.index
		],
		queryFn: () => releaseService.getAll(query),
		gcTime: 0
	})

	return {
		data: data?.data.release,
		totalCount: data?.data.totalCount,
		statistics: data?.data.statistics,
		errorReleases: data?.data.errorReleases,
		editReleases: data?.data.editReleases,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
