'use client'

import { MapPinned, Trash2 } from 'lucide-react'
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'

import { MapMini } from '@/components/maps/MapMini'
import { ModalDelete } from '@/components/ui/modal/ModalDelete'

import type { IAddress } from '@/types/address.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalAddress.module.scss'
import { useAddressDelete } from './hooks/useDelete'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	address: IAddress | null
	setAddress: Dispatch<SetStateAction<IAddress | null>>
	onEdit: () => void
}

export function ModalAddress({
	isOpen,
	onClose,
	address,
	setAddress,
	onEdit
}: ModalProps) {
	const [activeModal, setActiveModal] = useState(false)
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setAddress(null), setActiveModal(false))
	})
	useClickOutside(modalRef, () => {
		closeModal()
	})

	const { mutate, isPending, isSuccess } = useAddressDelete()
	const { data } = useGeneralSettingsStore()

	const handleMutate = () => {
		if (address?.id) mutate(address?.id)
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
							Информация о адресе
							<Trash2 onClick={() => setActiveModal(true)} />
						</h1>
						<div className={styles.body}>
							<div className={styles.flex}>
								<span>Название</span>
								<p>{address?.name}</p>
							</div>
						</div>
						{data?.activeMap === 'true' ? (
							address?.position ? (
								<div className={styles.form_map}>
									<h1>Расположения адреса</h1>
									<div className={styles.body}>
										<MapMini
											onlyPosition
											position={address?.position}
										/>
									</div>
								</div>
							) : (
								<div className={styles.no_activeMap}>
									<p>Расположения адреса не найдена. </p>
								</div>
							)
						) : (
							<div className={styles.no_activeMap}>
								<p>Карта деактивирована. </p>
							</div>
						)}
						<div className={styles.box_regions}>
							<div className={styles.top}>
								<h1>Привязан к</h1>
								<span>Всего: {address?.linkRegions?.length || 0}</span>
							</div>
							<div className={styles.list}>
								{address?.linkRegions && address?.linkRegions.length > 0 ? (
									address?.linkRegions?.map(link => (
										<div
											key={`${link?.region?.id}-address_region`}
											className={`${styles.region} ${data?.activeMap === 'true' && !link.region?.position ? styles.warn : ''}`}
										>
											<MapPinned />
											<p>{link.region?.name}</p>
										</div>
									))
								) : (
									<div className={styles.not_found}>Регионов не найдено</div>
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
