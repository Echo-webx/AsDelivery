'use client'

import { MapPinned, Trash2 } from 'lucide-react'
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'

import { ModalDelete } from '@/components/ui/modal/ModalDelete'

import { EnumUserRole, type IUser } from '@/types/user.types'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import { formatDayJs } from '@/utils/dateHelpers'

import styles from './ModalUser.module.scss'
import { useUserDelete } from './hooks/useDelete'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	user: IUser | null
	setUser: Dispatch<SetStateAction<IUser | null>>
	onEdit: () => void
}

export function ModalUser({
	isOpen,
	onClose,
	user,
	setUser,
	onEdit
}: ModalProps) {
	const [activeModal, setActiveModal] = useState(false)
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setUser(null), setActiveModal(false))
	})
	useClickOutside(modalRef, () => {
		closeModal()
	})

	const { mutate, isPending, isSuccess } = useUserDelete()

	const handleMutate = () => {
		if (user?.id) mutate(user?.id)
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
							Информация о пользователи
							<Trash2 onClick={() => setActiveModal(true)} />
						</h1>
						<div className={styles.body}>
							<div className={styles.flex}>
								<span>Роль</span>
								<p>
									{user?.role === EnumUserRole.manager && 'Менеджер'}
									{user?.role === EnumUserRole.default && 'Обычная'}
								</p>
							</div>
							<div className={styles.flex}>
								<span>Проверка региона</span>
								<p>
									{user?.checkRegion === true
										? 'Да, проверять'
										: 'Нет, игнорировать'}
								</p>
							</div>
							<div className={styles.flex}>
								<span>Должность</span> <p>{user?.info?.jobPosition}</p>
							</div>
							<div className={styles.flex}>
								<span>Email</span> <p>{user?.email}</p>
							</div>
							<div className={styles.flex}>
								<span>Имя</span> <p>{user?.info?.name}</p>
							</div>
							<div className={styles.flex}>
								<span>Фамилия</span> <p>{user?.info?.surname}</p>
							</div>
							<div className={styles.flex}>
								<span>Отчество</span> <p>{user?.info?.patronymic}</p>
							</div>
							<div className={styles.flex}>
								<span>День рождения</span>{' '}
								<p>{formatDayJs('standard', user?.info?.birthday)}</p>
							</div>
							<div className={styles.flex}>
								<span>Дата регистрации</span>{' '}
								<p>{formatDayJs('standard', user?.createdAt)}</p>
							</div>
						</div>

						<div className={styles.box_regions}>
							<div className={styles.top}>
								<h1>Привязан к</h1>
								<span>Всего: {user?.linkRegions?.length || 0}</span>
							</div>
							<div className={styles.list}>
								{user?.linkRegions && user?.linkRegions.length > 0 ? (
									user?.linkRegions?.map(link => (
										<div
											key={`${link?.region?.id}-user_region`}
											className={`${styles.region} ${!link.region?.position ? styles.warn : ''}`}
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
