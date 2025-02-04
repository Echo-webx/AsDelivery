'use client'

import { Boxes, Trash2 } from 'lucide-react'
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'

import { ModalDelete } from '@/components/ui/modal/ModalDelete'

import { EnumProductVisible, type IProduct } from '@/types/product.types'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalProduct.module.scss'
import { useProductDelete } from './hooks/useDelete'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	product: IProduct | null
	setProduct: Dispatch<SetStateAction<IProduct | null>>
	onEdit: () => void
}

export function ModalProduct({
	isOpen,
	onClose,
	product,
	setProduct,
	onEdit
}: ModalProps) {
	const [activeModal, setActiveModal] = useState(false)
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setProduct(null), setActiveModal(false))
	})
	useClickOutside(modalRef, () => {
		closeModal()
	})

	const { mutate, isPending, isSuccess } = useProductDelete()

	const handleMutate = () => {
		if (product?.id) mutate(product?.id)
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
							Информация о продукте
							<Trash2 onClick={() => setActiveModal(true)} />
						</h1>
						<div className={styles.body}>
							<div className={styles.flex}>
								<span>Видимость</span>
								<p>
									{product?.visible === EnumProductVisible.all && 'Виден всем'}
									{product?.visible === EnumProductVisible.release &&
										'Для реализаций'}
									{product?.visible === EnumProductVisible.reception &&
										'Для прихода'}
								</p>
							</div>
							<div className={styles.flex}>
								<span>Название</span>
								<p>{product?.name}</p>
							</div>
							<div className={styles.flex}>
								<span>Цена покупки</span>
								<p>{product?.purchasePrice} Тг</p>
							</div>
							<div className={styles.flex}>
								<span>Цена продажи</span>
								<p>{product?.salePrice} Тг</p>
							</div>
						</div>

						<div className={styles.box_categories}>
							<div className={styles.top}>
								<h1>Привязан к</h1>
								<span>Всего: {product?.linkCategories?.length || 0}</span>
							</div>
							<div className={styles.list}>
								{product?.linkCategories &&
								product?.linkCategories.length > 0 ? (
									product?.linkCategories?.map(link => (
										<div
											key={`${link?.category?.id}-product_category`}
											className={styles.category}
										>
											<Boxes />
											<p>{link.category?.name}</p>
										</div>
									))
								) : (
									<div className={styles.not_found}>Категорий не найдено</div>
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
