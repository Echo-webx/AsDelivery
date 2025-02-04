'use client'

import dayjs from 'dayjs'
import { ChartPie } from 'lucide-react'

import { Loader } from '@/components/loader/Loader'
import { MapMain } from '@/components/maps/MapMain'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { formatNumber } from '@/utils/formatters'

import { useActivity } from '../../hooks/useActivity'

import styles from './HomeDefault.module.scss'

export function HomeDefault() {
	const { data, isLoading, isFetching, isSuccess } = useActivity()
	const { data: dataGeneral } = useGeneralSettingsStore()

	const currentTime = dayjs().hour()

	return (
		<div className={styles.form}>
			<div className={styles.statistics}>
				{isLoading || isFetching ? (
					<Loader
						isLoading={isLoading || isFetching}
						type='dotted'
						box
						notShadow
					/>
				) : isSuccess ? (
					data?.statistics ? (
						<div className={styles.scroll}>
							<div className={styles.box}>
								<h1>Посещены</h1>
								<p>{formatNumber(data?.statistics?.confirm || 0)}</p>
							</div>
							{dataGeneral &&
							(currentTime < dataGeneral.startWorking ||
								currentTime >= dataGeneral.endWorking) ? (
								<div className={styles.box}>
									<h1>Пропущены</h1>
									<p>{formatNumber(data?.statistics?.error || 0)}</p>
								</div>
							) : (
								<div className={styles.box}>
									<h1>В ожидании</h1>
									<p>{formatNumber(data?.statistics?.waiting || 0)}</p>
								</div>
							)}
						</div>
					) : (
						<div className={styles.not_found}>
							<ChartPie size={20} />
							<p>Статистика отсутствуют</p>
						</div>
					)
				) : (
					<div className={styles.not_success}>Ошибка загрузки</div>
				)}
			</div>

			<div className={styles.map}>
				{dataGeneral?.activeMap === 'true' ? (
					<>
						<Loader
							isLoading={isLoading || isFetching}
							type='dotted'
							box
							notShadow
						/>
						<MapMain
							centerMap={data?.position
								?.split(',')
								.map(coord => parseFloat(coord))}
							dataMarker={data?.address?.map(address => ({
								position:
									address.position
										?.split(',')
										.map(coord => parseFloat(coord)) || [],
								name: address.name,
								status: address.status
							}))}
							isFetching={isFetching}
						/>
					</>
				) : (
					<p>Карта деактивирована.</p>
				)}
			</div>
		</div>
	)
}
