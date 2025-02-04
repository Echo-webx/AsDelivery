'use client'

import {
	type PropsWithChildren,
	createContext,
	useContext,
	useState
} from 'react'

interface LoaderContextProps {
	loadingItems: { [key: string]: boolean }
	isGlobalLoading: boolean
	setIsLoad: (id: string, visible: boolean) => void
	setIsGlobalLoad: (isGlobal: boolean) => void
}

const LoaderContext = createContext<LoaderContextProps | null>(null)

export const useLoaderContext = () => {
	const context = useContext(LoaderContext)
	if (!context)
		throw new Error('useLoaderContext must be used within LoaderProvider')
	return context
}

export const LoaderProvider = ({ children }: PropsWithChildren) => {
	const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
		{}
	)
	const [isGlobalLoading, setIsGlobalLoading] = useState(false)

	const setIsLoad = (id: string, visible: boolean) => {
		setLoadingItems(prev => ({ ...prev, [id]: visible }))
	}
	const setIsGlobalLoad = (isGlobal: boolean) => {
		setIsGlobalLoading(isGlobal)
	}

	return (
		<LoaderContext.Provider
			value={{ loadingItems, isGlobalLoading, setIsLoad, setIsGlobalLoad }}
		>
			{children}
		</LoaderContext.Provider>
	)
}
