'use client'

import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import {
	EnumProductVisible,
	type TypeProductCreate
} from '@/types/product.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalCreate.module.scss'
import { useProductCreate } from './hooks/useCreate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

export function ModalProductCreate({ isOpen, onClose }: ModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<TypeProductCreate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useProductCreate({
		reset
	})

	const onSubmit: SubmitHandler<TypeProductCreate> = rData => {
		mutate(rData)
	}

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => reset()
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
						<h1 className={styles.top}>Добавления продукта</h1>
						<Select
							name='visible'
							label='Видимость'
							placeholder='* Выберите видимость'
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
							extra={`mb-1`}
							error={errors.name?.message}
							{...register('name', { required: 'Требуется название' })}
						/>
						<DefaultField
							id='purchasePrice'
							label='Цена покупки'
							placeholder='* Введите цену покупки'
							type='purchasePrice'
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
								Добавить
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
