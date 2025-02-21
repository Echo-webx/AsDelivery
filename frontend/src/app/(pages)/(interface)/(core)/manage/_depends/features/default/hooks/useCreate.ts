import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeProductReleaseCreate } from '@/types/release.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { releaseService } from '@/services/release.service'

interface Props {
	clearProduct: () => void
}

export function useReleaseCreate({ clearProduct }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['send_release'],
		mutationFn: async (data: TypeProductReleaseCreate) => {
			await releaseService.create(data)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_profile']
			})
			queryClient.invalidateQueries({
				queryKey: ['get_workload']
			})
			clearProduct()
			toast.success('Успешно отправлено!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
