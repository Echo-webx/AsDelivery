import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { create } from 'zustand'

import type { IUser } from '@/types/user.types'

import { userService } from '@/services/user.service'

interface ProfileStore {
	data: IUser | null
	isLoading: boolean
	isSuccess: boolean
	isFetching: boolean
	setProfile: (data: IUser | null) => void
	setLoading: (isLoading: boolean) => void
	setSuccess: (isSuccess: boolean) => void
	setFetching: (isFetching: boolean) => void
}

export const useProfileStore = create<ProfileStore>(set => ({
	data: null,
	isLoading: true,
	isSuccess: false,
	isFetching: false,
	setProfile: data => set({ data }),
	setLoading: isLoading => set({ isLoading }),
	setSuccess: isSuccess => set({ isSuccess }),
	setFetching: isFetching => set({ isFetching })
}))

export function useProfile() {
	const { data, isLoading, isFetching, isSuccess, refetch } = useQuery({
		queryKey: ['get_profile'],
		queryFn: () => userService.getProfile(),
		refetchInterval: 300000
	})

	const { setProfile, setLoading, setSuccess } = useProfileStore()

	useEffect(() => {
		setSuccess(isSuccess)
		setLoading(isLoading)
		if (isSuccess && !isFetching && data.data) {
			setProfile(data.data)
		}
	}, [isSuccess, isLoading, isFetching])

	return {
		data: data?.data,
		status: data?.status,
		isLoading,
		isFetching,
		isSuccess,
		refetch
	}
}
