'use client'

import { useQueryClient } from '@tanstack/react-query'
import { DiscAlbum, Repeat2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import {
	EnumProductReleaseMarking,
	EnumProductReleaseStatus
} from '@/types/release.types'

import { CORE_PAGES } from '@/config/pages-url.config'

import { formatDayJs } from '@/utils/dateHelpers'
import { calculateWidths, formatNumber } from '@/utils/formatters'

import { TotalReleaseStatistics } from '../../features/release/TotalStatistics'
import { TotalReleaseWarn } from '../../features/release/TotalWarn'

import styles from './TotalRelease.module.scss'
import { useRelease } from './hooks/useRelease'

interface Props {
	date: string
	index: string
	dateTo: string | null
}

export function TotalRelease({ date, index, dateTo }: Props) {
	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const {
		data,
		isLoading,
		isSuccess,
		isFetching,
		totalCount,
		statistics,
		errorReleases,
		editReleases
	} = useRelease({
		page,
		limit,
		search,
		date,
		dateTo,
		index
	})
	const { totalPages, handleSearchChange } = usePaginationAndSearch({
		page,
		setPage,
		setSearch,
		totalCount,
		limit,
		isFetching
	})

	const queryClient = useQueryClient()
	const refreshAll = () => {
		queryClient.invalidateQueries({
			queryKey: ['get_users_default']
		})
		queryClient.invalidateQueries({
			queryKey: ['get_release']
		})
	}

	return (
		<>
			<TotalReleaseWarn
				isLoading={isLoading}
				isFetching={isFetching}
				data={data}
				editReleases={editReleases}
				errorReleases={errorReleases}
			/>
			<TotalReleaseStatistics
				isLoading={isLoading}
				isFetching={isFetching}
				statistics={statistics}
			/>

			<div className={styles.box_release}>
				<div className={styles.top}>
					<h1>Накладные на отпуск товаров</h1>
					<button
						onClick={() => refreshAll()}
						disabled={isLoading || isFetching}
					>
						<Repeat2 size={22} />
						Обновить
					</button>
				</div>
				<input
					onChange={handleSearchChange}
					placeholder='Поиск...'
					className={styles.search}
				></input>
				<div className={styles.list}>
					{isLoading || isFetching ? (
						<Loader
							isLoading={isLoading || isFetching}
							type='dotted'
							box
							notShadow
						/>
					) : isSuccess ? (
						data && data.length > 0 ? (
							data.map(rel => {
								const { saleWidth, swapWidth, bonusWidth } = calculateWidths(
									rel.totalSale,
									rel.totalSwap,
									rel.totalBonus
								)

								return (
									<Link
										href={`${CORE_PAGES.RELEASE}/${rel.id}`}
										key={rel.id}
										className={`${styles.release} ${
											rel.status === EnumProductReleaseStatus.error
												? styles.red
												: rel.status === EnumProductReleaseStatus.edit
													? styles.purple
													: ''
										}`}
									>
										<div className={styles.indicator}>
											<span
												className={styles.sale}
												style={{
													width: saleWidth
												}}
											></span>
											<span
												className={styles.swap}
												style={{
													width: swapWidth
												}}
											></span>
											<span
												className={styles.bonus}
												style={{
													width: bonusWidth
												}}
											></span>
										</div>
										<div className={styles.body}>
											{rel?.marking !== EnumProductReleaseMarking.null && (
												<div
													className={`${styles.marking} ${
														rel.marking === EnumProductReleaseMarking.deleted
															? styles.del
															: rel.marking ===
																  EnumProductReleaseMarking.accounting
																? styles.acc
																: ''
													}`}
												>
													{rel.marking === EnumProductReleaseMarking.deleted ? (
														<p>Помечено на удаление</p>
													) : rel.marking ===
													  EnumProductReleaseMarking.accounting ? (
														<p>Помечен как учтенный</p>
													) : (
														<p>Не маркирован</p>
													)}
												</div>
											)}
											<div className={styles.info}>
												<div className={styles.text}>
													<DiscAlbum />
													<p>{rel.tag}</p>
												</div>
												<div className={styles.text}>
													<p>{`${formatNumber(rel?.totalAmount)} тг`}</p>
												</div>
											</div>
											<div className={styles.flex}>
												<div className={styles.left}>
													<p>{rel.userFIO}</p>
													<p>{rel.addressName}</p>
												</div>
												<div className={styles.right}>
													<div className={styles.indicator}>
														{rel.totalCountError !== rel.totalCount && (
															<span
																className={`${rel.totalCount === 0 ? styles.green : styles.blue}`}
															>
																{rel.totalCount}
															</span>
														)}

														{rel.totalCountError !== null && (
															<span className={styles.red}>
																{rel.totalCountError}
															</span>
														)}
														{rel.totalCountEdit !== null && (
															<span className={styles.purple}>
																{rel.totalCountEdit}
															</span>
														)}
													</div>
													<span>
														{formatDayJs('D_MMMM_YYYY, HH:mm', rel?.createdAt)}
													</span>
												</div>
											</div>
										</div>
									</Link>
								)
							})
						) : (
							<div className={styles.not_found}>Реализации не найдены</div>
						)
					) : (
						<div className={styles.not_success}>Ошибка загрузки</div>
					)}
				</div>
			</div>
			<div className={styles.pagination}>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
					isFetching={isFetching}
				/>
			</div>
		</>
	)
}
