'use client'

import { Compass, Grid2x2Plus, MapPinned, OctagonAlert } from 'lucide-react'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { MapMain } from '@/components/maps/MapMain'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import type { IRegion } from '@/types/regions.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { formatDayJs } from '@/utils/dateHelpers'

import { ModalRegionCreate } from '../../features/regions/modal/ModalCreate'
import { ModalRegion } from '../../features/regions/modal/ModalRegion'
import { ModalRegionUpdate } from '../../features/regions/modal/ModalUpdate'

import styles from './RegionsSet.module.scss'
import { useRegions } from './hooks/useRegions'

export type ModalRegionsDashboard =
	| 'region'
	| 'regionCreate'
	| 'regionUpdate'
	| 'map'
	| null

export function RegionsSetDashboard() {
	const [activeModal, setActiveModal] = useState<ModalRegionsDashboard>(null)
	const [selectRegion, setSelectRegion] = useState<IRegion | null>(null)
	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isLoading, isSuccess, isFetching, totalCount } = useRegions(
		page,
		limit,
		search
	)

	const { data: dataGeneral } = useGeneralSettingsStore()

	const { totalPages, handleSearchChange } = usePaginationAndSearch({
		page,
		setPage,
		setSearch,
		totalCount,
		limit,
		isFetching
	})

	const handleRegionOpen = (region: IRegion) => {
		setSelectRegion(region)
		setActiveModal('region')
	}

	return (
		<div className={styles.main}>
			<div className={styles.form}>
				<button
					onClick={() => setActiveModal('regionCreate')}
					className={styles.btn_add}
				>
					<Grid2x2Plus />
					<p>Добавить регион</p>
				</button>
				<div className={styles.box_regions}>
					<div className={styles.top}>
						<h1>Регионы</h1>
						<button
							onClick={() =>
								setActiveModal(activeModal === 'map' ? null : 'map')
							}
							disabled={
								!isSuccess ||
								isFetching ||
								(activeModal !== 'map' && dataGeneral?.activeMap === 'false')
							}
						>
							<Compass size={22} />
							{activeModal !== 'map'
								? dataGeneral?.activeMap === 'false'
									? 'Карта деактивирована'
									: 'Открыть карту'
								: 'Закрыть карту'}
						</button>
					</div>
					{activeModal === 'map' ? (
						<div className={styles.map_window}>
							<Loader
								isLoading={isLoading || isFetching}
								type='dotted'
								box
								notShadow
							/>
							<MapMain
								dataMarker={data?.map(region => ({
									position:
										region.position
											?.split(',')
											.map(coord => parseFloat(coord)) || [],
									name: region.name
								}))}
								isFetching={isFetching}
							/>
						</div>
					) : (
						<>
							<input
								onChange={handleSearchChange}
								placeholder='Поиск...'
								className={styles.search}
							></input>
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
										data.map(region => (
											<div
												key={region.id}
												onClick={() => handleRegionOpen(region)}
												className={styles.region}
											>
												<div className={styles.body}>
													<MapPinned />
													<p>{region.name}</p>
													{dataGeneral?.activeMap === 'true' &&
														!region?.position && (
															<OctagonAlert className={styles.warn} />
														)}
												</div>

												<div className={styles.micro}>
													<p>
														Всего адресов: {region?.linkAddress?.length || 0}
													</p>
													<span>
														{formatDayJs('D_MMMM_YYYY', region?.createdAt)}
													</span>
												</div>
											</div>
										))
									) : (
										<div className={styles.not_found}>Регионов не найдено</div>
									)
								) : (
									<div className={styles.not_success}>Ошибка загрузки</div>
								)}
							</div>
						</>
					)}
				</div>
				<div className={styles.pagination}>
					<Pagination
						page={page}
						totalPages={totalPages}
						onPageChange={setPage}
						isFetching={isFetching}
					/>
				</div>
			</div>
			{activeModal === 'region' && (
				<ModalRegion
					isOpen={activeModal === 'region'}
					onClose={() => setActiveModal(null)}
					region={selectRegion}
					setRegion={setSelectRegion}
					onEdit={() => setActiveModal('regionUpdate')}
				/>
			)}

			{activeModal === 'regionCreate' && (
				<ModalRegionCreate
					isOpen={activeModal === 'regionCreate'}
					onClose={() => setActiveModal(null)}
				/>
			)}
			{activeModal === 'regionUpdate' && (
				<ModalRegionUpdate
					isOpen={activeModal === 'regionUpdate'}
					onClose={() => setActiveModal(null)}
					region={selectRegion}
					setRegion={setSelectRegion}
				/>
			)}
		</div>
	)
}
