'use client'

import { MapPinHouse, Trash2 } from 'lucide-react'
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'

import { MapMini } from '@/components/maps/MapMini'
import { ModalDelete } from '@/components/ui/modal/ModalDelete'

import type { IRegion } from '@/types/regions.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalRegion.module.scss'
import { useRegionDelete } from './hooks/useDelete'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	region: IRegion | null
	setRegion: Dispatch<SetStateAction<IRegion | null>>
	onEdit: () => void
}

export function ModalRegion({
	isOpen,
	onClose,
	region,
	setRegion,
	onEdit
}: ModalProps) {
	const [activeModal, setActiveModal] = useState(false)
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setRegion(null), setActiveModal(false))
	})
	useClickOutside(modalRef, () => {
		closeModal()
	})

	const { mutate, isPending, isSuccess } = useRegionDelete()
	const { data } = useGeneralSettingsStore()

	const handleMutate = () => {
		if (region?.id) mutate(region?.id)
	}

	useEffect(() => {
		if (isSuccess) {
			closeModal()
		}
	}, [isSuccess])

	if (!isOpen) return null

	return (
		<div
			className={`${styles.overlay} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
		>
			<div
				ref={modalRef}
				className={styles.content}
			>
				<div className={styles.form}>
					<div className={styles.scroll}>
						<h1 className={styles.top}>
							Информация о регионе
							<Trash2 onClick={() => setActiveModal(true)} />
						</h1>
						<div className={styles.body}>
							<div className={styles.flex}>
								<span>Название</span>
								<p>{region?.name}</p>
							</div>
						</div>
						{data?.activeMap === 'true' ? (
							region?.position ? (
								<div className={styles.form_map}>
									<h1>Расположения региона</h1>
									<div className={styles.body}>
										<MapMini
											onlyPosition
											position={region?.position}
										/>
									</div>
								</div>
							) : (
								<div className={styles.no_activeMap}>
									<p>Расположения региона не найдена. </p>
								</div>
							)
						) : (
							<div className={styles.no_activeMap}>
								<p>Карта деактивирована. </p>
							</div>
						)}
						<div className={styles.box_element}>
							<div className={styles.top}>
								<h1>Список адресов</h1>
								<span>Всего: {region?.linkAddress?.length || 0}</span>
							</div>
							<div className={styles.list}>
								{region?.linkAddress && region?.linkAddress.length > 0 ? (
									region?.linkAddress?.map(link => (
										<div
											key={`${link?.address?.id}-region_address`}
											className={`${styles.element} ${data?.activeMap === 'true' && !link.address?.position ? styles.warn : ''}`}
										>
											<MapPinHouse />
											<p>{link.address?.name}</p>
										</div>
									))
								) : (
									<div className={styles.not_found}>Адресов не найдено</div>
								)}
							</div>
						</div>
						<div className={styles.box_element}>
							<div className={styles.top}>
								<h1>Список продуктов</h1>
								<span>Всего: {region?.linkProducts?.length || 0}</span>
							</div>
							<div className={styles.list}>
								{region?.linkProducts && region?.linkProducts.length > 0 ? (
									region?.linkProducts?.map(link => (
										<div
											key={`${link?.product?.id}-region_product`}
											className={styles.element}
										>
											<MapPinHouse />
											<p>{link.product?.name}</p>
										</div>
									))
								) : (
									<div className={styles.not_found}>Продуктов не найдено</div>
								)}
							</div>
						</div>

						<div className={styles.button}>
							<button
								type='button'
								onClick={() => closeModal()}
							>
								Вернуться
							</button>
							<button
								type='submit'
								onClick={() => onEdit()}
								className={styles.edit}
							>
								Редактировать
							</button>
						</div>
						<ModalDelete
							isOpen={activeModal}
							onClose={() => setActiveModal(false)}
							handleMutate={() => handleMutate()}
							isPending={isPending}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
