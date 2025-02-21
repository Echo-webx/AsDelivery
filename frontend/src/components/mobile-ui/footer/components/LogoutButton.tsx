import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

import { authService } from '@/services/auth.service'

interface Props {
	extra: string
	children: ReactNode
}

export function LogoutButton({ extra, children }: Props) {
	const queryClient = useQueryClient()
	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(queryClient),
		onSuccess: () => push('/auth')
	})

	return (
		<button
			className={extra}
			onClick={() => mutate()}
		>
			{children}
		</button>
	)
}
