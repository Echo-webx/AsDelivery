'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Fragment, useState } from 'react'

import { Loader } from '@/components/loader/Loader'

import { EnumProductReleaseMarking } from '@/types/release.types'
import { EnumUserRole } from '@/types/user.types'

import { useProfileStore } from '@/store/useProfileStore'

import { formatDayJs } from '@/utils/dateHelpers'
import { formatNumber } from '@/utils/formatters'

import styles from './ReleaseItem.module.scss'
import { ModalReleaseUpdate } from './features/ModalUpdate'
import { useReleaseMarking } from './hooks/useMarking'
import { useReleaseItem } from './hooks/useReleaseItem'
import NotFound from '@/app/not-found'
import { SITE_NAME } from '@/consts/seo.constants'

export function ReleaseItem() {
	const [activeModal, setActiveModal] = useState(false)

	const { id } = useParams()
	const { data, isLoading, isSuccess } = useReleaseItem(id as string)

	const { data: dataProfile } = useProfileStore()

	const { mutate, isPending } = useReleaseMarking()

	const handleMutate = (type: EnumProductReleaseMarking) => {
		if (data?.id && data.marking)
			mutate({
				id: data?.id,
				marking:
					type === EnumProductReleaseMarking.deleted
						? data.marking === EnumProductReleaseMarking.deleted
							? EnumProductReleaseMarking.null
							: EnumProductReleaseMarking.deleted
						: type === EnumProductReleaseMarking.accounting
							? data.marking === EnumProductReleaseMarking.accounting
								? EnumProductReleaseMarking.null
								: EnumProductReleaseMarking.accounting
							: EnumProductReleaseMarking.null
			})
	}

	return isLoading ? (
		<Loader
			isLoading={isLoading}
			type='pulsing'
			box
		/>
	) : isSuccess && data ? (
		<div className={styles.main}>
			<div className={styles.header}>
				<h1>{data.regionName}</h1>
				<Link href={'/release'}>К накладным</Link>
			</div>

			<div className={styles.invoice}>
				{dataProfile?.role !== EnumUserRole.default && (
					<div className={styles.editing}>
						{data.marking === EnumProductReleaseMarking.null && (
							<button onClick={() => setActiveModal(true)}>Изменить</button>
						)}
						{dataProfile?.role === EnumUserRole.root && (
							<>
								<button
									onClick={() =>
										handleMutate(EnumProductReleaseMarking.accounting)
									}
									disabled={isPending}
									className={styles.acc}
								>
									<Loader
										isLoading={isPending}
										type='dotted'
										box
										notShadow
									/>
									{data?.marking === EnumProductReleaseMarking.accounting
										? 'Снять с учета'
										: 'На учет'}
								</button>
								<button
									onClick={() =>
										handleMutate(EnumProductReleaseMarking.deleted)
									}
									disabled={isPending}
									className={styles.del}
								>
									<Loader
										isLoading={isPending}
										type='dotted'
										box
										notShadow
									/>
									{data?.marking === EnumProductReleaseMarking.deleted
										? 'Снять удаления'
										: 'На удаление'}
								</button>
							</>
						)}
					</div>
				)}
				<div className={styles.top}>
					<p>Накладная {data?.tag}</p>
					<span>{`От ${formatDayJs('D_MMMM_YYYY, HH:mm', data?.createdAt)}`}</span>
				</div>
				<div className={styles.sub_top}>
					<p>От кого: {SITE_NAME}</p>
					<p>Кому: {data.addressName}</p>
				</div>
				<div className={styles.total}>
					<div className={styles.scroll}>
						<div className={styles.box}>
							<h1>Продажи</h1>
							<p>{formatNumber(data?.totalSale || 0)}</p>
						</div>
						<div className={styles.box}>
							<h1>Обмены</h1>
							<p>{formatNumber(data?.totalSwap || 0)}</p>
						</div>
						<div className={styles.box}>
							<h1>Бонусы</h1>
							<p>{formatNumber(data?.totalBonus || 0)}</p>
						</div>
						<div className={styles.box}>
							<h1>Общая сумма</h1>
							<p>{`${formatNumber(data?.totalAmount || 0)} тг`}</p>
						</div>
					</div>
				</div>
				{data?.marking !== EnumProductReleaseMarking.null && (
					<div
						className={`${styles.marking} ${
							data.marking === EnumProductReleaseMarking.deleted
								? styles.del
								: data.marking === EnumProductReleaseMarking.accounting
									? styles.acc
									: ''
						}`}
					>
						{data.marking === EnumProductReleaseMarking.deleted ? (
							<p>Помечено на удаление</p>
						) : data.marking === EnumProductReleaseMarking.accounting ? (
							<p>Помечен как учтенный</p>
						) : (
							<p>Не маркирован</p>
						)}
					</div>
				)}
				<div className={styles.body}>
					<div className={styles.scroll}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th className={styles.index}>
										<p>№</p>
									</th>
									<th className={styles.name}>
										<p>Наименование</p>
									</th>
									<th>
										<p>Цена</p>
									</th>
									<th>
										<p>Сумма</p>
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.position?.map((item, index) => (
									<Fragment key={item.id}>
										<tr>
											<th
												rowSpan={2}
												className={styles.index}
											>
												<p>{index + 1}</p>
											</th>
											<td className={styles.name}>
												<p>{item.name}</p>
											</td>
											<td className={styles.boldNumber}>
												<p>{`${formatNumber(item.salePrice)} тг`}</p>
											</td>
											<td className={styles.boldNumber}>
												<p>{`${formatNumber(item.amount)} тг`}</p>
											</td>
										</tr>
										<tr>
											<td
												colSpan={3}
												className={styles.subTable}
											>
												<div className={styles.flex}>
													<div className={styles.tdCount}>
														<div className={styles.block}>
															<p>{`Остаток ${
																item.countError &&
																item.countError !== item.count
																	? '| Ошибки'
																	: ''
															} ${item.countEdit !== null ? '| Изменения' : ''}`}</p>
															<div className={styles.indicator}>
																{item.countError !== item.count && (
																	<span
																		className={`${item.count === 0 ? styles.green : styles.blue}`}
																	>
																		<p>{item.count}</p>
																	</span>
																)}
																{item.countError !== null && (
																	<span className={styles.red}>
																		<p>{item.countError}</p>
																	</span>
																)}
																{item.countEdit !== null && (
																	<span className={styles.purple}>
																		<p>{item.countEdit}</p>
																	</span>
																)}
															</div>
														</div>
													</div>
													<div className={styles.tdQuantity}>
														<div className={styles.block}>
															<p>Продажа</p>
															<div className={styles.indicator}>
																<span className={styles.sale}>
																	<p>{item.quantitySale}</p>
																</span>
															</div>
														</div>
														<div className={styles.block}>
															<p>Обмен</p>
															<div className={styles.indicator}>
																<span className={styles.swap}>
																	<p>{item.quantitySwap}</p>
																</span>
															</div>
														</div>
														<div className={styles.block}>
															<p>Бонус</p>
															<div className={styles.indicator}>
																<span className={styles.bonus}>
																	<p>{item.quantityBonus}</p>
																</span>
															</div>
														</div>
													</div>
												</div>
											</td>
										</tr>
									</Fragment>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className={styles.bottom}>
					<div className={styles.left}>
						<span>Сдал:</span>
						<p>{data.userFIO}</p>
					</div>
					<div className={styles.right}>
						<span>Принял:</span>
						<p>Не указано</p>
					</div>
				</div>
			</div>
			{activeModal && (
				<ModalReleaseUpdate
					isOpen={activeModal}
					onClose={() => setActiveModal(false)}
					release={data}
				/>
			)}
		</div>
	) : (
		<NotFound />
	)
}
