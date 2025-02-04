import { type Dispatch, type SetStateAction, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import type {
	IProductCategory,
	TypeProductCategoryUpdate
} from '@/types/product-category.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import { useProducts } from '../../main/hooks/useProduct'

import styles from './ModalUpdate.module.scss'
import { useCategoryUpdate } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	productCategory: IProductCategory | null
	setProductCategory: Dispatch<SetStateAction<IProductCategory | null>>
}

export function ModalCategoryUpdate({
	isOpen,
	onClose,
	productCategory,
	setProductCategory
}: ModalProps) {
	const [limit, setLimit] = useState(20)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isFetching, totalCount } = useProducts(page, limit, search)

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors }
	} = useForm<TypeProductCategoryUpdate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useCategoryUpdate()

	const onSubmit: SubmitHandler<TypeProductCategoryUpdate> = data => {
		if (productCategory?.id)
			mutate({ id: productCategory?.id, productCategory: data })
	}

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setProductCategory(null), reset())
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
						<h1 className={styles.top}>Изменения категории</h1>
						<Select
							name='productsId'
							label='Продукты'
							placeholder='Выбрать'
							defaultData={productCategory?.linkProducts.map(a => ({
								value: a.product?.id ?? '',
								content: a.product?.name ?? ''
							}))}
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
							defaultValue={productCategory?.name}
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
								Изменить
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
