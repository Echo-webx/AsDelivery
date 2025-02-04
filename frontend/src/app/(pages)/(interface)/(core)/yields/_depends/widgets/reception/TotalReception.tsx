import { useQueryClient } from '@tanstack/react-query'
import { ClipboardPlus, Disc3, Repeat2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import {
	EnumProductReceptionMarking,
	EnumProductReceptionStatus
} from '@/types/reception.types'

import { CORE_PAGES } from '@/config/pages-url.config'

import { formatDayJs } from '@/utils/dateHelpers'
import { formatNumber } from '@/utils/formatters'

import { TotalReceptionStatistics } from '../../features/reception/TotalStatistics'
import { TotalReceptionWarn } from '../../features/reception/TotalWarn'
import { useReception } from '../../features/reception/hooks/useReception'
import { ModalReceptionCreate } from '../../features/reception/modal/ModalCreate'

import styles from './TotalReception.module.scss'

interface Props {
	date: string
	dateTo: string | null
}

export function TotalReception({ date, dateTo }: Props) {
	const [activeModal, setActiveModal] = useState(false)

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
		editReceptions
	} = useReception({
		page,
		limit,
		search,
		date,
		dateTo
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
			queryKey: ['get_reception']
		})
	}

	return (
		<div className={styles.main}>
			<button
				onClick={() => setActiveModal(true)}
				className={styles.btn_add}
			>
				<ClipboardPlus />
				<p>Добавить накладную</p>
			</button>

			<TotalReceptionWarn
				isLoading={isLoading}
				isFetching={isFetching}
				data={data}
				editReceptions={editReceptions}
			/>
			<TotalReceptionStatistics
				isLoading={isLoading}
				isFetching={isFetching}
				statistics={statistics}
			/>

			<div className={styles.box_reception}>
				<div className={styles.top}>
					<h1>Накладные прихода товаров</h1>
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
							data.map(rec => (
								<Link
									href={`${CORE_PAGES.YIELDS}/${CORE_PAGES.RECEPTION}/${rec.id}`}
									key={rec.id}
									className={`${styles.reception} ${
										rec.status === EnumProductReceptionStatus.edit
											? styles.purple
											: ''
									}`}
								>
									<div className={styles.body}>
										{rec?.marking !== EnumProductReceptionMarking.null && (
											<div
												className={`${styles.marking} ${
													rec.marking === EnumProductReceptionMarking.deleted
														? styles.del
														: rec.marking ===
															  EnumProductReceptionMarking.accounting
															? styles.acc
															: ''
												}`}
											>
												{rec.marking === EnumProductReceptionMarking.deleted ? (
													<p>Помечено на удаление</p>
												) : rec.marking ===
												  EnumProductReceptionMarking.accounting ? (
													<p>Помечен как учтенный</p>
												) : (
													<p>Не маркирован</p>
												)}
											</div>
										)}
										<div className={styles.info}>
											<div className={styles.text}>
												<Disc3 />
												<p>{rec.tag}</p>
											</div>
											<div className={styles.text}>
												<p>{`${formatNumber(rec?.totalAmount)} тг`}</p>
											</div>
										</div>
										<div className={styles.flex}>
											<div className={styles.left}>
												<p>{rec.userFIO}</p>
												<p>{rec.vendor}</p>
											</div>
											<div className={styles.right}>
												<div className={styles.indicator}>
													<span className={styles.blue}>
														{rec.totalQuantity}
													</span>
												</div>
												<span>
													{formatDayJs('D_MMMM_YYYY, HH:mm', rec?.createdAt)}
												</span>
											</div>
										</div>
									</div>
								</Link>
							))
						) : (
							<div className={styles.not_found}>Поставки не найдены</div>
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

			{activeModal && (
				<ModalReceptionCreate
					isOpen={activeModal}
					onClose={() => setActiveModal(false)}
				/>
			)}
		</div>
	)
}
