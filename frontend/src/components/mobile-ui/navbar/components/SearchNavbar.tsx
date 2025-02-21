'use client'

import Link from 'next/link'
import { type MutableRefObject, useEffect, useRef, useState } from 'react'

import { Loader } from '@/components/loader/Loader'

import { CORE_PAGES } from '@/config/pages-url.config'

import { useSearch } from '@/hooks/useSearch'

import { useSearchNavbar } from '../hooks/useSearchNavbar'

import styles from './SearchNavbar.module.scss'

interface Props {
	isSearchOpen: boolean
	isAnimSearch: boolean
	toggleSearch: (type: boolean) => void
	searchRef: MutableRefObject<HTMLDivElement | null>
}

export function SearchNavbar({
	isSearchOpen,
	isAnimSearch,
	searchRef,
	toggleSearch
}: Props) {
	const [searchQuery, setSearchQuery] = useState('')
	const inputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (isSearchOpen && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isSearchOpen])

	const { data, isLoading, isFetching, isSuccess } =
		useSearchNavbar(searchQuery)

	const { handleSearchChange } = useSearch({ setSearchQuery })

	function getIndicatorTag(tag: string) {
		return tag.split('-')[0]
	}

	return (
		<>
			<div
				ref={searchRef}
				className={`${styles.search} ${isAnimSearch ? styles.fadeOut : styles.fadeIn}`}
			>
				<input
					ref={inputRef}
					placeholder='Поиск...'
					onChange={handleSearchChange}
				></input>
				{data && data.length > 0 ? (
					<div className={`${styles.result} ${styles.fadeIn}`}>
						<div className={styles.list}>
							{data.map(r => (
								<Link
									onClick={() => toggleSearch(false)}
									href={
										getIndicatorTag(`${r.tag}`) === 'DEL'
											? `${CORE_PAGES.RELEASE}/${r.id}`
											: getIndicatorTag(`${r.tag}`) === 'GRN'
												? `${CORE_PAGES.YIELDS}/${CORE_PAGES.RECEPTION}/${r.id}`
												: ``
									}
									key={r.id}
									className={`${styles.item} ${styles.fadeIn}`}
								>
									<p>{`${r.tag}`}</p>
								</Link>
							))}
						</div>
					</div>
				) : (
					searchQuery !== '' &&
					(isLoading || isFetching ? (
						<div className={`${styles.result} ${styles.fadeIn}`}>
							<div className={styles.loading}>
								<Loader
									isLoading={isLoading || isFetching}
									type='dotted'
									box
									notShadow
								/>
							</div>
						</div>
					) : isSuccess ? (
						<div className={`${styles.result} ${styles.fadeIn}`}>
							<div className={styles.not_found}>
								<p>Нет результата</p>
							</div>
						</div>
					) : (
						<div className={`${styles.result} ${styles.fadeIn}`}>
							<div className={styles.not_success}>
								<p>Произошла ошибка</p>
							</div>
						</div>
					))
				)}
			</div>
			<div
				className={`${styles.searchBg} ${isAnimSearch ? styles.fadeDown : styles.fadeUp}`}
			/>
		</>
	)
}
