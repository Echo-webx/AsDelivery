import { useQuery } from '@tanstack/react-query'

import { generalService } from '@/services/general'

export function useGeneral() {
	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ['get_general_dashboard'],
		queryFn: () => generalService.getGeneral()
	})

	return {
		data: data?.data,
		status: data?.status,
		isLoading,
		isSuccess,
		refetch
	}
}
