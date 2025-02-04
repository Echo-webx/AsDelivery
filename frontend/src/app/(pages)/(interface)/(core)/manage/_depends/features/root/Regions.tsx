import { MapPinned, PackageOpen, Trash2 } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { ModalDelete } from '@/components/ui/modal/ModalDelete'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import type { IRegion } from '@/types/regions.types'
import type { IUser } from '@/types/user.types'

import { formatDayJs } from '@/utils/dateHelpers'

import { FormRegionAdd } from './FormRegionAdd'
import styles from './Regions.module.scss'
import type { ManageModal } from './UserDefaultSet'
import { useRegionRemove } from './hooks/useRegionRemove'
import { useUserRegions } from './hooks/useUserRegions'

export type GroupDefault = 'product' | 'region' | null

interface Props {
	setActiveGroup?: Dispatch<SetStateAction<GroupDefault>>
	activeModal: ManageModal
	setActiveModal: Dispatch<SetStateAction<ManageModal>>
	user: IUser
}

export function ManageRegions({
	setActiveGroup,
	activeModal,
	setActiveModal,
	user
}: Props) {
	const [selectRegion, setSelectRegion] = useState<IRegion | null>(null)
	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isLoading, isSuccess, isFetching, totalCount } = useUserRegions(
		user.id,
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

	const { mutate, isPending, isSuccess: isSuccessDelete } = useRegionRemove()

	const handleMutate = () => {
		if (selectRegion?.id)
			mutate({
				id: user.id,
				regionId: selectRegion.id
			})
	}

	useEffect(() => {
		if (isSuccessDelete && activeModal === 'deleteRegion') {
			setActiveModal(null)
		}
	}, [isSuccessDelete])

	return (
		<>
			<FormRegionAdd user={user} />

			<div className={styles.box_regions}>
				<div className={styles.top}>
					<h1>Привязка к региону</h1>
					{setActiveGroup && (
						<button onClick={() => setActiveGroup('product')}>
							<PackageOpen size={22} /> Погрузка
						</button>
					)}
				</div>
				<input
					onChange={handleSearchChange}
					placeholder='Поиск...'
					className={styles.search}
				></input>

				<div className={styles.relative}>
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
										key={`${region.id}-${user.id}-region`}
										className={styles.region}
									>
										<div className={styles.body}>
											<MapPinned />
											<p>{region.name}</p>
											<Trash2
												onClick={() => {
													setSelectRegion(region),
														setActiveModal('deleteRegion')
												}}
												className={styles.del}
											/>
										</div>

										<div className={styles.micro}>
											<p>Всего адресов: {region?.linkAddress?.length || 0}</p>
											<span>
												{formatDayJs(
													'D_MMMM_YYYY',
													region?.linkUsers[0].updatedAt
												)}
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
				</div>
			</div>
			<div className={styles.pagination}>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
					isFetching={isFetching}
				/>
			</div>

			<ModalDelete
				isOpen={activeModal === 'deleteRegion'}
				onClose={() => setActiveModal(null)}
				handleMutate={() => handleMutate()}
				isPending={isPending}
			/>
		</>
	)
}
