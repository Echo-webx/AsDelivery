import { MapPinHouse } from 'lucide-react'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'

import styles from './ReportStatistics.module.scss'
import { useReleaseStatisticsAddress } from './hooks/useStatAddress'
import { ModalAddress } from './modal/ModalAddress'

interface Props {
	date: string
	index: string
	dateTo: string | null
}

export function ReportAddressRelease({ date, dateTo, index }: Props) {
	const [activeModal, setActiveModal] = useState(false)
	const [selectAddress, setSelectAddress] = useState('')

	const { data, isLoading, isSuccess, isFetching } =
		useReleaseStatisticsAddress({
			date,
			dateTo,
			index
		})

	function formatNumber(number: number) {
		return number.toLocaleString('ru-RU')
	}

	return (
		<>
			<div className={`${styles.box_statistics} `}>
				<h1>Сводка по адресам</h1>
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
							data.map((stat, index) => (
								<div
									key={`${stat.id}-${stat.name}-${index}`}
									onClick={() => {
										setSelectAddress(stat.id), setActiveModal(true)
									}}
									className={`${styles.item} ${styles.active}`}
								>
									<div className={styles.body}>
										<div className={styles.block}>
											<p>{stat.operationCount}</p>
										</div>
										<div className={`${styles.block} ${styles.full}`}>
											<MapPinHouse />
											<p>{stat.name}</p>
											<span>
												{`${formatNumber(stat?.totalAmount || 0)} тг`}
											</span>
										</div>
									</div>
									<div className={styles.micro}>
										<div className={`${styles.block} ${styles.full}`}>
											<p>Продажа</p>
											<span className={styles.sale}>{stat.totalSale}</span>
										</div>
										<div className={`${styles.block} ${styles.full}`}>
											<p>Обмен</p>
											<span className={styles.swap}>{stat.totalSwap}</span>
										</div>
										<div className={`${styles.block} ${styles.full}`}>
											<p>Бонус</p>
											<span className={styles.bonus}>{stat.totalBonus}</span>
										</div>
									</div>
								</div>
							))
						) : (
							<div className={styles.not_found}>Данные не найдены</div>
						)
					) : (
						<div className={styles.not_success}>Ошибка загрузки</div>
					)}
				</div>
			</div>
			{selectAddress && (
				<ModalAddress
					isOpen={activeModal}
					onClose={() => setActiveModal(false)}
					date={date}
					dateTo={dateTo}
					index={index}
					addressId={selectAddress}
					setAddressId={setSelectAddress}
				/>
			)}
		</>
	)
}
