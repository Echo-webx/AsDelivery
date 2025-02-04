'use client'

import { TriangleAlert } from 'lucide-react'
import { useRef } from 'react'

import { Loader } from '@/components/loader/Loader'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalDelete.module.scss'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	handleMutate: () => void
	isPending: boolean
}

export function ModalDelete({
	isOpen,
	onClose,
	handleMutate,
	isPending
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, isAnim } = useToggleModal({ onClose })
	useClickOutside(modalRef, () => closeModal(), isPending)

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
					<Loader
						isLoading={isPending}
						type='pulsing'
						box
					/>
					<h1 className={styles.top}>
						<TriangleAlert size={20} />
						Безвозвратное удаление
						<TriangleAlert size={20} />
					</h1>
					<div className={styles.button}>
						<button
							type='button'
							disabled={isPending}
							onClick={() => closeModal()}
						>
							Отменить
						</button>
						<button
							type='submit'
							disabled={isPending}
							onClick={() => handleMutate()}
							className={styles.delete}
						>
							Удалить
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
