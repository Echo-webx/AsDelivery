import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeWorkloadUpsert } from '@/types/workload.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { workloadService } from '@/services/workload.service'

export function useWorkloadSend() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['send_workload'],
		mutationFn: async (data: TypeWorkloadUpsert) => {
			await workloadService.upsert(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_workload_user']
			})
			queryClient.invalidateQueries({
				queryKey: ['get_users_default']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
