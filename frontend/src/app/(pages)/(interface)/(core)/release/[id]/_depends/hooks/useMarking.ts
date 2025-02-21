import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EnumProductReleaseMarking } from '@/types/release.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { releaseService } from '@/services/release.service'

interface Mutate {
	id: string
	marking: EnumProductReleaseMarking
}

export function useReleaseMarking() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['marking_release'],
		mutationFn: async (data: Mutate) => {
			await releaseService.marking(data.id, data.marking)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['get_release_item']
			})
			toast.success('Изменения внесены!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
