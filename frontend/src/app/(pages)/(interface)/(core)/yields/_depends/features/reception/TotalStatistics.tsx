import { ChartPie } from 'lucide-react'

import { Loader } from '@/components/loader/Loader'

import type { ReceptionStatistics } from '@/types/reception.types'

import { formatNumber } from '@/utils/formatters'

import styles from '../../widgets/reception/TotalReception.module.scss'

interface Props {
	isLoading: boolean
	isFetching: boolean
	statistics?: ReceptionStatistics
}

export function TotalReceptionStatistics({
	isFetching,
	isLoading,
	statistics
}: Props) {
	return (
		<div className={styles.total}>
			{isLoading || isFetching ? (
				<Loader
					isLoading={isLoading || isFetching}
					type='dotted'
					box
					notShadow
				/>
			) : statistics?.totalAmount ? (
				<div className={styles.scroll}>
					<div className={styles.box}>
						<h1>Общая сумма</h1>
						<p>{`${formatNumber(statistics?.totalAmount || 0)} тг`}</p>
					</div>
				</div>
			) : (
				<div className={styles.not_found}>
					<ChartPie size={20} />
					<p>Статистика отсутствуют</p>
				</div>
			)}
		</div>
	)
}
