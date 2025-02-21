import { useQuery } from '@tanstack/react-query'

import { salaryService } from '@/services/salary.service'

export function useSalaryStatistics(week: string, group: 'week' | 'month') {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: [`get_salary_${group}`, week],
		queryFn: () => salaryService.getStatistics(week, group),
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
