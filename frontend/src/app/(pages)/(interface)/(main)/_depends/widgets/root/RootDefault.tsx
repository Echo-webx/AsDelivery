'use client'

import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import { Loader } from '@/components/loader/Loader'

import { formatNumber } from '@/utils/formatters'

import { useAllStatistics } from '../../hooks/useStatistics'

import styles from './RootDefault.module.scss'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function RootDefault() {
	const { data, isLoading, isFetching, isSuccess } = useAllStatistics()

	const monthLabels = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	]

	const chartData = {
		labels: monthLabels,
		datasets: [
			{
				label: 'Сумма за год',
				data: monthLabels.map((_, index) => {
					const monthData = data?.month.find(item => item.month === index + 1)
					return monthData ? monthData.totalAmount : 0
				}),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			},
			{
				label: 'Рейтинг за год',
				data: monthLabels.map((_, index) => {
					const monthData = data?.month.find(item => item.month === index + 1)
					if (monthData) {
						const { totalSale, totalSwap, totalBonus } = monthData
						const denominator = totalSwap + totalBonus
						return denominator !== 0 ? totalSale / denominator : 0
					}
					return 0
				}),
				backgroundColor: 'rgba(192, 178, 75, 0.6)',
				borderColor: 'rgba(192, 178, 75, 1)',
				borderWidth: 1
			}
		]
	}

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: {
					font: { size: 14 }
				}
			},
			tooltip: {
				mode: 'index' as const,
				intersect: false
			}
		}
	}

	return (
		<div className={styles.form}>
			<div className={styles.chart_month}>
				{isLoading || isFetching ? (
					<Loader
						isLoading={isLoading || isFetching}
						type='dotted'
						box
						notShadow
					/>
				) : isSuccess ? (
					<Bar
						data={chartData}
						options={chartOptions}
					/>
				) : (
					<div className={styles.not_success}>Ошибка загрузки</div>
				)}
			</div>
			<div className={styles.top_users}>
				<div className={styles.top}>
					<h1>Топ пользователей</h1>
				</div>
				<div className={styles.list}>
					{isLoading || isFetching ? (
						<Loader
							isLoading={isLoading || isFetching}
							type='dotted'
							box
							notShadow
						/>
					) : isSuccess ? (
						data?.users && data.users.length > 0 ? (
							data.users.map((user, index) => (
								<div
									key={`${user.userId}-top`}
									className={styles.user}
								>
									<span className={styles.index}>
										<p>{index + 1}</p>
									</span>
									<span className={styles.full}>
										<p>{`${user.name} ${user.surname} ${user.patronymic}`}</p>
									</span>
									<span>
										<p>{`${formatNumber(user.totalAmount)} тг`}</p>
									</span>
									<span className={styles.rating}>
										<p>
											{(
												user.totalSale /
												(user.totalSwap + user.totalBonus)
											).toFixed(3)}
										</p>
									</span>
								</div>
							))
						) : (
							<div className={styles.not_found}>
								Топ пользователей отсутствует
							</div>
						)
					) : (
						<div className={styles.not_success}>Ошибка загрузки</div>
					)}
				</div>
			</div>
		</div>
	)
}
