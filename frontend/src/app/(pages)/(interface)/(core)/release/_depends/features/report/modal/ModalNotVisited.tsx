'use client'

import { User, X } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import { Loader } from '@/components/loader/Loader'
import { MapMini } from '@/components/maps/MapMini'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { useToggleModal } from '@/hooks/useToggleModal'

import { formatDayJs } from '@/utils/dateHelpers'

import { useReleaseStatisticsOneNotVisited } from '../hooks/useStatOneNotVisited'

import styles from './ModalNotVisited.module.scss'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	date: string
	index: string
	dateTo: string | null
	addressId: string
	setAddressId: Dispatch<SetStateAction<string>>
}

export function ModalNotVisited({
	isOpen,
	onClose,
	date,
	dateTo,
	index,
	addressId,
	setAddressId
}: ModalProps) {
	const { data, isLoading, isSuccess } = useReleaseStatisticsOneNotVisited(
		{
			date,
			dateTo,
			index
		},
		addressId
	)

	const { data: dataGeneral } = useGeneralSettingsStore()

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => setAddressId('')
	})

	if (!isOpen) return null

	return (
		<div
			className={`${styles.overlay} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
		>
			<div className={styles.content}>
				<div className={styles.form}>
					<div className={styles.scroll}>
						<div className={styles.top}>
							<h1>
								{isLoading ? (
									<Loader
										isLoading={isLoading}
										type='dotted'
										box
										notShadow
									/>
								) : isSuccess ? (
									data?.address.name
								) : (
									<div className={styles.not_success}>Ошибка загрузки</div>
								)}
							</h1>
							<span onClick={() => closeModal()}>
								<X />
							</span>
						</div>
						{dataGeneral?.activeMap === 'true' ? (
							isLoading ? (
								<div className={styles.form_map}>
									<Loader
										isLoading={isLoading}
										type='dotted'
										box
										notShadow
									/>
								</div>
							) : isSuccess && data ? (
								data.address.position ? (
									<div className={styles.form_map}>
										<h1>Расположения региона</h1>
										<div className={styles.body}>
											<MapMini
												onlyPosition
												position={data.address.position}
											/>
										</div>
									</div>
								) : (
									<div className={styles.no_activeMap}>
										<p>Расположения региона не найдена. </p>
									</div>
								)
							) : (
								<div className={styles.form_map}>
									<div className={styles.not_success}>Ошибка загрузки</div>
								</div>
							)
						) : (
							<div className={styles.no_activeMap}>
								<p>Карта деактивирована. </p>
							</div>
						)}
						<div className={`${styles.box_statistics} `}>
							<h1>Ответственные лица</h1>
							<div className={styles.list}>
								{isLoading ? (
									<Loader
										isLoading={isLoading}
										type='dotted'
										box
										notShadow
									/>
								) : isSuccess ? (
									data && data.users.length > 0 ? (
										data.users.map(user => (
											<div
												key={user.id}
												className={styles.profile}
											>
												<div className={styles.body}>
													<User />
													<p>
														{`${user.info?.name} ${user.info?.surname} ${user.info?.patronymic}`}
													</p>
												</div>

												<div className={styles.micro}>
													<p>{user.email}</p>
													<span>
														{formatDayJs('D_MMMM_YYYY', user?.createdAt)}
													</span>
												</div>
											</div>
										))
									) : (
										<div className={styles.not_found}>Сводка не найдена</div>
									)
								) : (
									<div className={styles.not_success}>Ошибка загрузки</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
