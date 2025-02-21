import { useQuery } from '@tanstack/react-query'

import { salaryService } from '@/services/salary.service'

export function useSalary(week: string) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_salary', week],
		queryFn: () => salaryService.getAll(week),
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
