import { Package } from 'lucide-react'

import { Loader } from '@/components/loader/Loader'

import styles from './ReportStatistics.module.scss'
import { useReleaseStatisticsProduct } from './hooks/useStatProduct'

interface Props {
	date: string
	index: string
	dateTo: string | null
}

export function ReportProductRelease({ date, dateTo, index }: Props) {
	const { data, isLoading, isSuccess, isFetching } =
		useReleaseStatisticsProduct({
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
				<h1>Сводка по продуктам</h1>
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
									className={styles.item}
								>
									<div className={styles.body}>
										<div className={styles.block}>
											<p>{stat.operationCount}</p>
										</div>
										<div className={`${styles.block} ${styles.full}`}>
											<Package />
											<p>{stat.name}</p>
											<span> {`${formatNumber(stat?.amount || 0)} тг`}</span>
										</div>
									</div>
									<div className={styles.micro}>
										<div className={`${styles.block} ${styles.full}`}>
											<p>Продажа</p>
											<span className={styles.sale}>{stat.quantitySale}</span>
										</div>
										<div className={`${styles.block} ${styles.full}`}>
											<p>Обмен</p>
											<span className={styles.swap}>{stat.quantitySwap}</span>
										</div>
										<div className={`${styles.block} ${styles.full}`}>
											<p>Бонус</p>
											<span className={styles.bonus}>{stat.quantityBonus}</span>
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
		</>
	)
}
