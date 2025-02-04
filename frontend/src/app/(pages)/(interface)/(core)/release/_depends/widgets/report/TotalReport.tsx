import { useState } from 'react'

import { ReportAddressRelease } from '../../features/report/ReportAddress'
import { ReportNotVisitedRelease } from '../../features/report/ReportNotVisited'
import { ReportProductRelease } from '../../features/report/ReportProduct'

import styles from './TotalReport.module.scss'

interface Props {
	date: string
	dateTo: string | null
	index: string
}

export type ReportGroup = 'product' | 'address' | 'notVisited'

export function TotalReport({ date, dateTo, index }: Props) {
	const [activeGroup, setActiveGroup] = useState<ReportGroup>('product')

	return (
		<>
			<div className={styles.buttons}>
				<button
					onClick={() => setActiveGroup('product')}
					className={activeGroup === 'product' ? styles.active : ''}
				>
					Продукты
				</button>
				<button
					onClick={() => setActiveGroup('address')}
					className={activeGroup === 'address' ? styles.active : ''}
				>
					Адреса
				</button>
				<button
					onClick={() => setActiveGroup('notVisited')}
					className={activeGroup === 'notVisited' ? styles.active : ''}
				>
					Посещения
				</button>
			</div>
			{activeGroup === 'product' && (
				<ReportProductRelease
					date={date}
					dateTo={dateTo}
					index={index}
				/>
			)}
			{activeGroup === 'address' && (
				<ReportAddressRelease
					date={date}
					dateTo={dateTo}
					index={index}
				/>
			)}
			{activeGroup === 'notVisited' && (
				<ReportNotVisitedRelease
					date={date}
					dateTo={dateTo}
					index={index}
				/>
			)}
		</>
	)
}
