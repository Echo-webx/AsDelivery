import { useQuery } from '@tanstack/react-query'

import type { TypeSearch, TypeSearchDate } from '@/types/root.types'

import { receptionService } from '@/services/reception.service'

export function useReception(query: TypeSearch & TypeSearchDate) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: [
			'get_reception',
			query.page,
			query.limit,
			query.search,
			query.date,
			query.dateTo
		],
		queryFn: () => receptionService.getAll(query),
		gcTime: 0
	})

	return {
		data: data?.data.reception,
		totalCount: data?.data.totalCount,
		statistics: data?.data.statistics,
		editReceptions: data?.data.editReceptions,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
