import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { create } from 'zustand'

import type { TypeGeneral } from '@/types/general.types'

import { generalService } from '@/services/general'

interface GeneralSettingsStore {
	data: TypeGeneral | null
	isLoading: boolean
	isSuccess: boolean
	isFetching: boolean
	setData: (data: TypeGeneral | null) => void
	setLoading: (isLoading: boolean) => void
	setSuccess: (isSuccess: boolean) => void
	setFetching: (isFetching: boolean) => void
}

export const useGeneralSettingsStore = create<GeneralSettingsStore>(set => ({
	data: null,
	isLoading: false,
	isSuccess: false,
	isFetching: false,
	setData: data => set({ data }),
	setLoading: isLoading => set({ isLoading }),
	setSuccess: isSuccess => set({ isSuccess }),
	setFetching: isFetching => set({ isFetching })
}))

export function useGeneralSettings() {
	const { data, isLoading, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ['get_generalSettings'],
		queryFn: () => generalService.getGeneralSettings(),
		refetchInterval: 300000
	})

	const { setData, setLoading, setSuccess } = useGeneralSettingsStore()

	useEffect(() => {
		setSuccess(isSuccess)
		setLoading(isLoading)
		if (isSuccess && !isFetching && data.data) {
			setData(data.data)
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
