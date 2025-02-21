import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import styles from './Pagination.module.scss'

interface Props {
	page: number
	totalPages: number
	onPageChange: (page: number) => void
	isFetching: boolean
}

export function Pagination({
	page,
	totalPages,
	onPageChange,
	isFetching
}: Props) {
	const [maxVisiblePages, setMaxVisiblePages] = useState(6)

	const generatePages = () => {
		let pages: (number | string)[] = []

		// Максимальное количество страниц без учета первой и последней
		const maxMiddlePages = maxVisiblePages - 3 // -2 для первой и последней страницы

		// Вычисляем стартовую и конечную страницы для отображения
		const start = Math.max(2, page - Math.floor(maxMiddlePages / 2))
		const end = Math.min(totalPages - 1, page + Math.floor(maxMiddlePages / 2))

		// Добавляем первую страницу
		pages.push(1)

		if (totalPages === 4 && page === 4) {
			pages.push(2)
		}
		if (totalPages > 4 && page === totalPages) {
			pages.push(totalPages - 3)
			pages.push(totalPages - 2)
		}
		if (totalPages > 4 && page === totalPages - 1) {
			pages.push(totalPages - 3)
		}

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		if (totalPages === 4 && page === 1) {
			pages.push(3)
		}

		if (totalPages > 4 && page === 1) {
			pages.push(3)
			pages.push(4)
		}
		if (totalPages > 4 && page === 2) {
			pages.push(4)
		}

		// Добавляем последнюю страницу
		if (totalPages > 1) {
			pages.push(totalPages)
		}

		// Убедимся, что количество страниц не превышает maxVisiblePages
		while (pages.length > maxVisiblePages) {
			// Если страниц больше, чем maxVisiblePages, удаляем троеточие или крайние страницы
			if (pages[1] === '...') {
				pages.splice(1, 1) // удаляем первое троеточие
			} else if (pages[pages.length - 2] === '...') {
				pages.splice(pages.length - 2, 1) // удаляем последнее троеточие
			} else {
				break
			}
		}

		return pages
	}

	return (
		<div className={styles.pagination}>
			<button
				onClick={() => onPageChange(page - 1)}
				disabled={page === 1}
			>
				<ChevronLeft />
			</button>

			{generatePages().map((curPage, index) =>
				typeof curPage === 'number' ? (
					<button
						key={index}
						disabled={curPage === page || isFetching}
						className={curPage === page ? styles.active : ''}
						onClick={() => onPageChange(curPage)}
					>
						{curPage}
					</button>
				) : (
					<span key={index}>...</span>
				)
			)}

			<button
				onClick={() => onPageChange(page + 1)}
				disabled={page === totalPages}
			>
				<ChevronRight />
			</button>
		</div>
	)
}
