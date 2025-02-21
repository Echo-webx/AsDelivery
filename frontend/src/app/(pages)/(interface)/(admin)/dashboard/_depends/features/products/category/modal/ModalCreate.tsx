'use client'

import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import type { TypeProductCategoryCreate } from '@/types/product-category.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import { useProducts } from '../../main/hooks/useProduct'

import styles from './ModalCreate.module.scss'
import { useCategoryCreate } from './hooks/useCreate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

export function ModalCategoryCreate({ isOpen, onClose }: ModalProps) {
	const [limit, setLimit] = useState(20)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isFetching, totalCount } = useProducts(page, limit, search)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<TypeProductCategoryCreate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useCategoryCreate({
		reset
	})

	const onSubmit: SubmitHandler<TypeProductCategoryCreate> = rData => {
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
						<h1 className={styles.top}>Добавления категории</h1>
						<Select
							name='productsId'
							label='Продукты'
							placeholder='Выбрать'
							setValue={setValue}
							multiple
							lodash
							pagination
							totalCount={totalCount}
							page={page}
							limit={limit}
							setPage={setPage}
							isFetching={isFetching}
							onSearchChange={setSearch}
							error={errors.productsId?.message}
							extra={`mb-1`}
							s_scrollHight={5}
							register={register('productsId', {
								required: 'Требуются продукты'
							})}
						>
							{data?.map(product => (
								<Option
									key={product.id}
									value={product.id}
									content={product.name}
								/>
							))}
						</Select>
						<DefaultField
							id='name'
							label='Название'
							placeholder='* Введите название'
							type='name'
							extra={`mb-3`}
							error={errors.name?.message}
							{...register('name', {
								required: 'Требуется название'
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
