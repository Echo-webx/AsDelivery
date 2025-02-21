'use client'

import type { Dispatch, SetStateAction } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import {
	EnumProductVisible,
	type IProduct,
	type TypeProductUpdate
} from '@/types/product.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalUpdate.module.scss'
import { useProductUpdate } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	product: IProduct | null
	setProduct: Dispatch<SetStateAction<IProduct | null>>
}

export function ModalProductUpdate({
	isOpen,
	onClose,
	product,
	setProduct
}: ModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<TypeProductUpdate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useProductUpdate()

	const onSubmit: SubmitHandler<TypeProductUpdate> = data => {
		if (product?.id) mutate({ id: product?.id, product: data })
	}
	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setProduct(null), reset())
	})

	if (!isOpen) return null

	return (
		<div
			className={`${styles.overlay} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
		>
			<div className={styles.content}>
				<form
					className={styles.form}
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className={styles.scroll}>
						<Loader
							isLoading={isPending}
							type='pulsing'
							box
						/>
						<h1 className={styles.top}>Изменения продукта</h1>
						<Select
							name='visible'
							label='Видимость'
							placeholder='* Выберите видимость'
							defaultValue={product?.visible}
							extra={`mb-1 ${styles.rSelect}`}
							setValue={setValue}
							error={errors.visible?.message}
							register={register('visible', {
								required: 'Требуется видимость'
							})}
						>
							<Option
								value={EnumProductVisible.all}
								content='Виден всем'
							/>
							<Option
								value={EnumProductVisible.release}
								content='Для реализаций'
							/>
							<Option
								value={EnumProductVisible.reception}
								content='Для прихода'
							/>
						</Select>
						<DefaultField
							id='name'
							label='Название'
							placeholder='* Введите название'
							type='name'
							defaultValue={product?.name}
							extra={`mb-1`}
							error={errors.name?.message}
							{...register('name', { required: 'Требуется название' })}
						/>
						<DefaultField
							id='purchasePrice'
							label='Цена покупки'
							placeholder='* Введите цену покупки'
							type='purchasePrice'
							defaultValue={product?.purchasePrice}
							isNumber
							extra={`mb-1`}
							error={errors.purchasePrice?.message}
							{...register('purchasePrice', {
								required: 'Требуется цена покупки',
								valueAsNumber: true
							})}
						/>
						<DefaultField
							id='salePrice'
							label='Цена продажи'
							placeholder='* Введите цену продажи'
							type='salePrice'
							defaultValue={product?.salePrice}
							isNumber
							extra={`mb-3`}
							error={errors.salePrice?.message}
							{...register('salePrice', {
								required: 'Требуется цена продажи',
								valueAsNumber: true
							})}
						/>

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
								className={styles.add}
							>
								Изменить
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
