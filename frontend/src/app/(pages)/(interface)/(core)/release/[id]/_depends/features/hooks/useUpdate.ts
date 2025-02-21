import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TypeProductReleasePositionUpdate } from '@/types/release.types'

import useToast from '@/hooks/useToast'

import { errorMessage } from '@/utils/errorHelpers'

import { releaseService } from '@/services/release.service'

interface Mutate {
	id: string
	release: TypeProductReleasePositionUpdate
}

export function useReleaseUpdate() {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationKey: ['update_release'],
		mutationFn: async (data: Mutate) => {
			await releaseService.update(data.id, data.release)
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ['get_release_item']
			})
			toast.success('Успешно изменен!')
		},
		onError(err) {
			errorMessage(err, toast)
		}
	})

	return { mutate, isPending, isSuccess }
}
