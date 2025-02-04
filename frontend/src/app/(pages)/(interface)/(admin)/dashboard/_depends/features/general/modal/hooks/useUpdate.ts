import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { IGeneral } from '@/types/general.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { generalService } from '@/services/general'

export function useGeneralUpdate() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update_general_dashboard'],
		mutationFn: async (data: IGeneral) => {
			return (await generalService.putGeneral(data)).data
		},
		onSuccess: async (rData: IGeneral) => {
			queryClient.setQueryData<IGeneral>(['get_general_dashboard'], rData)
			queryClient.invalidateQueries({
				queryKey: ['get_generalSettings']
			})
			toast.success('Успешно изменено!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending }
}
