import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeSalaryUpsert } from '@/types/salary.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { salaryService } from '@/services/salary.service'

export function useSalarySend() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['send_salary'],
		mutationFn: async (data: TypeSalaryUpsert) => {
			await salaryService.upsert(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_salary']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
