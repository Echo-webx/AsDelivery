import { MapPinHouse } from 'lucide-react'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'

import { EnumUserRole } from '@/types/user.types'

import { useProfileStore } from '@/store/useProfileStore'

import styles from './ReportStatistics.module.scss'
import { useReleaseStatisticsNotVisited } from './hooks/useStatNotVisited'
import { ModalNotVisited } from './modal/ModalNotVisited'

interface Props {
	date: string
	index: string
	dateTo: string | null
}

export function ReportNotVisitedRelease({ date, dateTo, index }: Props) {
	const [activeModal, setActiveModal] = useState(false)
	const [selectAddress, setSelectAddress] = useState('')

	const { data: dataProfile } = useProfileStore()

	const { data, isLoading, isSuccess, isFetching } =
		useReleaseStatisticsNotVisited({
			date,
			dateTo,
			index
		})

	return (
		<>
			<div className={`${styles.box_statistics} `}>
				<h1>Сводка по не посещенным</h1>
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
										dataProfile?.role !== EnumUserRole.default &&
											(setSelectAddress(stat.id), setActiveModal(true))
									}}
									className={`${styles.item} ${dataProfile?.role !== EnumUserRole.default ? styles.active : ''}`}
								>
									{}
									<div className={styles.body}>
										<div className={`${styles.block} ${styles.full}`}>
											<MapPinHouse />
											<p>{stat.name}</p>
										</div>
										{dataProfile?.role !== EnumUserRole.default && (
											<div className={styles.block}>
												<p>{stat.userCount}</p>
											</div>
										)}
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
				<ModalNotVisited
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
