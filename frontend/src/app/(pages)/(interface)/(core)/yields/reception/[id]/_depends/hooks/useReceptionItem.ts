import { useQuery } from '@tanstack/react-query'

import { receptionService } from '@/services/reception.service'

export function useReceptionItem(id: string) {
	const { data, isLoading, isFetching, isSuccess, refetch } = useQuery({
		queryKey: ['get_reception_item', id],
		queryFn: () => receptionService.getOne(id),
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
