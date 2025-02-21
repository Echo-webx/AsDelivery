import { useQuery } from '@tanstack/react-query'

import { salaryService } from '@/services/salary.service'

export function useSalaryUsers(
	week: string,
	page: number,
	limit: number,
	search: string
) {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_salary_users', week, page, limit, search],
		queryFn: () => salaryService.getFor(week, { page, limit, search })
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
