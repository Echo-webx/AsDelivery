'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Fragment, useState } from 'react'

import { Loader } from '@/components/loader/Loader'

import { EnumProductReceptionMarking } from '@/types/reception.types'
import { EnumUserRole } from '@/types/user.types'

import { CORE_PAGES } from '@/config/pages-url.config'

import { useProfileStore } from '@/store/useProfileStore'

import { formatDayJs } from '@/utils/dateHelpers'
import { formatNumber } from '@/utils/formatters'

import styles from './ReceptionItem.module.scss'
import { ModalUpdateReception } from './features/ModalUpdate'
import { useMarkingReception } from './hooks/useMarking'
import { useReceptionItem } from './hooks/useReceptionItem'
import NotFound from '@/app/not-found'
import { SITE_NAME } from '@/consts/seo.constants'

export function ReceptionItem() {
	const [activeModal, setActiveModal] = useState(false)

	const { id } = useParams()
	const { data, isLoading, isSuccess } = useReceptionItem(id as string)

	const { data: dataProfile } = useProfileStore()

	const { mutate, isPending } = useMarkingReception()

	const handleMutate = (type: EnumProductReceptionMarking) => {
		if (data?.id && data.marking)
			mutate({
				id: data?.id,
				marking:
					type === EnumProductReceptionMarking.deleted
						? data.marking === EnumProductReceptionMarking.deleted
							? EnumProductReceptionMarking.null
							: EnumProductReceptionMarking.deleted
						: type === EnumProductReceptionMarking.accounting
							? data.marking === EnumProductReceptionMarking.accounting
								? EnumProductReceptionMarking.null
								: EnumProductReceptionMarking.accounting
							: EnumProductReceptionMarking.null
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
				<h1></h1>
				<Link href={CORE_PAGES.YIELDS}>К накладным</Link>
			</div>

			<div className={styles.invoice}>
				{dataProfile?.role !== EnumUserRole.default && (
					<div className={styles.editing}>
						{data.marking === EnumProductReceptionMarking.null && (
							<button onClick={() => setActiveModal(true)}>Изменить</button>
						)}
						{dataProfile?.role === EnumUserRole.root && (
							<>
								<button
									onClick={() =>
										handleMutate(EnumProductReceptionMarking.accounting)
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
									{data?.marking === EnumProductReceptionMarking.accounting
										? 'Снять с учета'
										: 'На учет'}
								</button>
								<button
									onClick={() =>
										handleMutate(EnumProductReceptionMarking.deleted)
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
									{data?.marking === EnumProductReceptionMarking.deleted
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
					<p>От кого: {data.vendor}</p>
					<p>Кому: {SITE_NAME}</p>
				</div>
				<div className={styles.total}>
					<div className={styles.scroll}>
						<div className={styles.box}>
							<h1>Общая сумма</h1>
							<p>{`${formatNumber(data?.totalAmount || 0)} тг`}</p>
						</div>
					</div>
				</div>
				{data?.marking !== EnumProductReceptionMarking.null && (
					<div
						className={`${styles.marking} ${
							data.marking === EnumProductReceptionMarking.deleted
								? styles.del
								: data.marking === EnumProductReceptionMarking.accounting
									? styles.acc
									: ''
						}`}
					>
						{data.marking === EnumProductReceptionMarking.deleted ? (
							<p>Помечено на удаление</p>
						) : data.marking === EnumProductReceptionMarking.accounting ? (
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
												<p>{`${formatNumber(item.purchasePrice)} тг`}</p>
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
													<div className={styles.block}>
														<p>Количество:</p>
														<div className={styles.indicator}>
															<span className={styles.sale}>
																<p>{item.quantity}</p>
															</span>
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
				<ModalUpdateReception
					isOpen={activeModal}
					onClose={() => setActiveModal(false)}
					reception={data}
				/>
			)}
		</div>
	) : (
		<NotFound />
	)
}
