import { UserCircle } from 'lucide-react'

import { Loader } from '@/components/loader/Loader'

import { formatNumber } from '@/utils/formatters'

import styles from '../../widgets/salary/Salary.module.scss'

import { useSalaryStatistics } from './hooks/useSalaryStatistics'

interface Props {
	week: string
	group: 'week' | 'month'
}

export function Statistics({ week, group }: Props) {
	const { data, isLoading, isSuccess } = useSalaryStatistics(week, group)

	return (
		<div className={styles.table}>
			<h1>Заработная плата сотрудников</h1>
			<div className={styles.relative}>
				<div className={styles.list}>
					{isLoading ? (
						<Loader
							isLoading={isLoading}
							type='dotted'
							box
							notShadow
						/>
					) : isSuccess ? (
						data && data.length > 0 ? (
							data.map(item => (
								<div
									key={`${item.id}-salary`}
									className={styles.item}
								>
									<div className={styles.left}>
										<UserCircle />
										<p>{`${item.name} ${item.surname} ${item.patronymic}`}</p>
									</div>
									<div className={styles.right}>
										<p>{`${formatNumber(item.wages || 0)} тг`}</p>
									</div>
								</div>
							))
						) : (
							<div className={styles.not_found}>Статистика не найдена</div>
						)
					) : (
						<div className={styles.not_success}>Ошибка загрузки</div>
					)}
				</div>
			</div>
		</div>
	)
}
