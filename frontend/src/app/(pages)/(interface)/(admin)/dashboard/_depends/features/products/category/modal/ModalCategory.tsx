'use client'

import { MapPinHouse, Trash2 } from 'lucide-react'
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'

import { ModalDelete } from '@/components/ui/modal/ModalDelete'

import type { IProductCategory } from '@/types/product-category.types'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalCategory.module.scss'
import { useCategoryDelete } from './hooks/useDelete'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	productCategory: IProductCategory | null
	setProductCategory: Dispatch<SetStateAction<IProductCategory | null>>
	onEdit: () => void
}

export function ModalCategory({
	isOpen,
	onClose,
	productCategory,
	setProductCategory,
	onEdit
}: ModalProps) {
	const [activeModal, setActiveModal] = useState(false)
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setProductCategory(null), setActiveModal(false))
	})
	useClickOutside(modalRef, () => {
		closeModal(), setActiveModal(false)
	})

	const { mutate, isPending, isSuccess } = useCategoryDelete()

	const handleMutate = () => {
		if (productCategory?.id) mutate(productCategory?.id)
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
							Информация о категории
							<Trash2 onClick={() => setActiveModal(true)} />
						</h1>
						<div className={styles.body}>
							<div className={styles.flex}>
								<span>Название</span>
								<p>{productCategory?.name}</p>
							</div>
						</div>

						<div className={styles.box_products}>
							<div className={styles.top}>
								<h1>Список продуктов</h1>
								<span>Всего: {productCategory?.linkProducts?.length || 0}</span>
							</div>
							<div className={styles.list}>
								{productCategory?.linkProducts &&
								productCategory?.linkProducts.length > 0 ? (
									productCategory?.linkProducts?.map(link => (
										<div
											key={`${link?.product?.id}-category_product`}
											className={styles.product}
										>
											<MapPinHouse />
											<p>{link.product?.name}</p>
										</div>
									))
								) : (
									<div className={styles.not_found}>Адресов не найдено</div>
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
