'use client'

import { Package, X } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import { Loader } from '@/components/loader/Loader'
import { MapMini } from '@/components/maps/MapMini'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { useToggleModal } from '@/hooks/useToggleModal'

import { useReleaseStatisticsOneAddress } from '../hooks/useStatOneAddress'

import styles from './ModalAddress.module.scss'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	date: string
	index: string
	dateTo: string | null
	addressId: string
	setAddressId: Dispatch<SetStateAction<string>>
}

export function ModalAddress({
	isOpen,
	onClose,
	date,
	dateTo,
	index,
	addressId,
	setAddressId
}: ModalProps) {
	const { data, isLoading, isSuccess } = useReleaseStatisticsOneAddress(
		{
			date,
			dateTo,
			index
		},
		addressId
	)
	const { data: dataGeneral } = useGeneralSettingsStore()

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => setAddressId('')
	})

	function formatNumber(number: number) {
		return number.toLocaleString('ru-RU')
	}

	if (!isOpen) return null

	return (
		<div
			className={`${styles.overlay} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
		>
			<div className={styles.content}>
				<div className={styles.form}>
					<div className={styles.scroll}>
						<div className={styles.top}>
							<h1>
								{isLoading ? (
									<Loader
										isLoading={isLoading}
										type='dotted'
										box
										notShadow
									/>
								) : isSuccess ? (
									data?.address.addressName
								) : (
									<div className={styles.not_success}>Ошибка загрузки</div>
								)}
							</h1>
							<span onClick={() => closeModal()}>
								<X />
							</span>
						</div>
						{dataGeneral?.activeMap === 'true' ? (
							isLoading ? (
								<div className={styles.form_map}>
									<Loader
										isLoading={isLoading}
										type='dotted'
										box
										notShadow
									/>
								</div>
							) : isSuccess && data ? (
								data.address.addressPosition ? (
									<div className={styles.form_map}>
										<h1>Расположения региона</h1>
										<div className={styles.body}>
											<MapMini
												onlyPosition
												position={data.address.addressPosition}
											/>
										</div>
									</div>
								) : (
									<div className={styles.no_activeMap}>
										<p>Расположения региона не найдена. </p>
									</div>
								)
							) : (
								<div className={styles.form_map}>
									<div className={styles.not_success}>Ошибка загрузки</div>
								</div>
							)
						) : (
							<div className={styles.no_activeMap}>
								<p>Карта деактивирована. </p>
							</div>
						)}
						<div className={`${styles.box_statistics} `}>
							<h1>Сводка по продуктам</h1>
							<div className={styles.list}>
								{isLoading ? (
									<Loader
										isLoading={isLoading}
										type='dotted'
										box
										notShadow
									/>
								) : isSuccess ? (
									data && data.products.length > 0 ? (
										data.products.map((stat, index) => (
											<div
												key={`${stat.id}-${stat.name}-${index}`}
												className={styles.item}
											>
												<div className={styles.body}>
													<div className={styles.block}>
														<p>{stat.operationCount}</p>
													</div>
													<div className={`${styles.block} ${styles.full}`}>
														<Package />
														<p>{stat.name}</p>
														<span>
															{`${formatNumber(stat?.amount || 0)} тг`}
														</span>
													</div>
												</div>
												<div className={styles.micro}>
													<div className={`${styles.block} ${styles.full}`}>
														<p>Продажа</p>
														<span className={styles.sale}>
															{stat.quantitySale}
														</span>
													</div>
													<div className={`${styles.block} ${styles.full}`}>
														<p>Обмен</p>
														<span className={styles.swap}>
															{stat.quantitySwap}
														</span>
													</div>
													<div className={`${styles.block} ${styles.full}`}>
														<p>Бонус</p>
														<span className={styles.bonus}>
															{stat.quantityBonus}
														</span>
													</div>
												</div>
											</div>
										))
									) : (
										<div className={styles.not_found}>Сводка не найдена</div>
									)
								) : (
									<div className={styles.not_success}>Ошибка загрузки</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
