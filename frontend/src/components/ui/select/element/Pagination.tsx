import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import styles from '../Select.module.scss'

interface Props {
	isFetching?: boolean
	totalPages?: number
	page?: number
	setPage?: Dispatch<SetStateAction<number>>
}

export function PaginationSelect({
	isFetching,
	totalPages,
	page,
	setPage
}: Props) {
	if (!totalPages || !page || !setPage) return null

	return (
		<div className={styles.pagination}>
			<button
				onClick={() => setPage(page - 1)}
				disabled={page === 1 || isFetching}
			>
				{isFetching ? (
					<RefreshCw className={styles.spinner} />
				) : (
					<ChevronLeft />
				)}
			</button>
			<button
				onClick={() => setPage(page + 1)}
				disabled={page === totalPages || isFetching}
			>
				{isFetching ? (
					<RefreshCw className={styles.spinner} />
				) : (
					<ChevronRight />
				)}
			</button>
		</div>
	)
}
