import { useIsFetching, useIsMutating } from '@tanstack/react-query'

import { useLoaderContext } from '../../providers/LoaderProvider'

import styles from './Loader.module.scss'

export type TypeLoad = 'spinning' | 'pulsing' | 'dotted'
export type TypeLoadMode = 'all' | 'isLoading' | 'context' | 'default'

interface LoaderStyle {
	type?: TypeLoad
	box?: boolean
	min?: boolean
	notBg?: boolean
	notShadow?: boolean
}

interface LoaderWithId extends LoaderStyle {
	id: string
	isLoading?: never
	mode?: never
}

interface LoaderWithoutId extends LoaderStyle {
	id?: never
	isLoading?: boolean
	mode?: TypeLoadMode
}

export type LoaderProps = LoaderWithId | LoaderWithoutId

export function Loader({
	id,
	isLoading,
	mode: initialMode,
	type = 'spinning',
	box = false,
	min = false,
	notBg = false,
	notShadow = false
}: LoaderProps) {
	const { loadingItems, isGlobalLoading } = useLoaderContext()
	const isMutating = useIsMutating()
	const isFetching = useIsFetching()

	const mode = id
		? undefined
		: initialMode || (isLoading !== undefined ? 'isLoading' : 'default')

	const isVisible = id
		? loadingItems[id]
		: (mode === 'all' &&
				(isLoading || isGlobalLoading || isFetching > 0 || isMutating > 0)) ||
			(mode === 'isLoading' && isLoading) ||
			(mode === 'context' && isGlobalLoading) ||
			(mode === 'default' && (isFetching > 0 || isMutating > 0))

	if (!isVisible) return null

	const loaderStyle =
		type === 'pulsing'
			? styles.pulsing
			: type === 'dotted'
				? styles.dotted
				: styles.loader

	return (
		<div
			className={`${box ? styles.box : styles.full} ${notBg ? styles.notBg : ''} ${notShadow ? styles.notShadow : ''}`}
		>
			<div className={`${loaderStyle} ${min ? styles.min : ''}`}></div>
		</div>
	)
}
