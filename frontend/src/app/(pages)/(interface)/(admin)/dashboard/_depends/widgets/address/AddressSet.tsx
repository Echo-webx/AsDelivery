'use client'

import { Compass, HousePlus, MapPinHouse, OctagonAlert } from 'lucide-react'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { MapMain } from '@/components/maps/MapMain'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import type { IAddress } from '@/types/address.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { formatDayJs } from '@/utils/dateHelpers'

import { ModalAddress } from '../../features/address/modal/ModalAddress'
import { ModalAddressCreate } from '../../features/address/modal/ModalCreate'
import { ModalAddressUpdate } from '../../features/address/modal/ModalUpdate'

import styles from './AddressSet.module.scss'
import { useAddress } from './hooks/useAddress'

export type ModalAddressDashboard =
	| 'address'
	| 'create'
	| 'update'
	| 'map'
	| null

export function AddressSetDashboard() {
	const [activeModal, setActiveModal] = useState<ModalAddressDashboard>(null)
	const [selectAddress, setSelectAddress] = useState<IAddress | null>(null)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [limit, setLimit] = useState(30)

	const { data, isLoading, isSuccess, isFetching, totalCount } = useAddress(
		page,
		limit,
		search
	)
	const { totalPages, handleSearchChange } = usePaginationAndSearch({
		page,
		setPage,
		setSearch,
		totalCount,
		limit,
		isFetching
	})
	const { data: dataGeneral } = useGeneralSettingsStore()

	const handleAddressOpen = (address: IAddress) => {
		setSelectAddress(address)
		setActiveModal('address')
	}

	return (
		<div className={styles.main}>
			<div className={styles.form}>
				<button
					onClick={() => setActiveModal('create')}
					className={styles.btn_add}
				>
					<HousePlus />
					<p>Добавить адрес</p>
				</button>
				<div className={styles.box_address}>
					<div className={styles.top}>
						<h1>Адреса</h1>
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
								dataMarker={data?.map(address => ({
									position: address.position
										.split(',')
										.map(coord => parseFloat(coord)),
									name: address.name
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
										data.map(address => (
											<div
												key={address.id}
												onClick={() => handleAddressOpen(address)}
												className={styles.address}
											>
												<div className={styles.body}>
													<MapPinHouse />
													<p>{address.name}</p>
													{dataGeneral?.activeMap === 'true' &&
														!address?.position && (
															<OctagonAlert className={styles.warn} />
														)}
												</div>

												<div className={styles.micro}>
													<p>Привязан к: {address?.linkRegions?.length || 0}</p>
													<span>
														{formatDayJs('D_MMMM_YYYY', address?.createdAt)}
													</span>
												</div>
											</div>
										))
									) : (
										<div className={styles.not_found}>Адресов не найдено</div>
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
			{activeModal == 'address' && (
				<ModalAddress
					isOpen={activeModal === 'address'}
					onClose={() => setActiveModal(null)}
					address={selectAddress}
					setAddress={setSelectAddress}
					onEdit={() => setActiveModal('update')}
				/>
			)}
			{activeModal == 'create' && (
				<ModalAddressCreate
					isOpen={activeModal === 'create'}
					onClose={() => setActiveModal(null)}
				/>
			)}
			{activeModal == 'update' && (
				<ModalAddressUpdate
					isOpen={activeModal === 'update'}
					onClose={() => setActiveModal(null)}
					address={selectAddress}
					setAddress={setSelectAddress}
				/>
			)}
		</div>
	)
}
