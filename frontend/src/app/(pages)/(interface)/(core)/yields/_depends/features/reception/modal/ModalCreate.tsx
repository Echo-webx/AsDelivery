'use client'

import { BadgeDollarSign, Coins, Package, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { OptionSpan } from '@/components/ui/select/element/OptionSpan'

import useToast from '@/hooks/useToast'
import { useToggleModal } from '@/hooks/useToggleModal'

import { useArray } from '../hooks/useArray'
import { useReceptionCreate } from '../hooks/useCreate'
import { useProductReception } from '../hooks/useProduct'
import { useValidError } from '../hooks/useValidError'

import styles from './ModalCreate.module.scss'

export interface NewCreate {
	key: string
	id?: string
	name: string
	quantity: number
	purchasePrice: number
	group: 'new' | 'old' | null
}

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

export function ModalReceptionCreate({ isOpen, onClose }: ModalProps) {
	const [vendor, setVendor] = useState<string>()
	const [newCreate, setNewCreate] = useState<NewCreate[]>([
		{
			key: uuidV4(),
			name: '',
			quantity: 0,
			purchasePrice: 0,
			group: null
		}
	])

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [search, setSearch] = useState('')
	const [searchValue, setSearchValue] = useState('')

	const {
		addProduct,
		clearProduct,
		toggleGroup,
		handleProductChange,
		handleDeleteProduct
	} = useArray({
		newCreate,
		setNewCreate
	})

	const { getFieldError, validateForm, checkDuplicateClass, hasDuplicateName } =
		useValidError({ newCreate, styles })

	const { toast } = useToast()

	const { data, isFetching, totalCount } = useProductReception(
		page,
		limit,
		search
	)

	const { mutate, isPending } = useReceptionCreate({ clearProduct })

	const handleMutate = () => {
		console.log({
			vendor,
			items: newCreate
		})
		if (!vendor) {
			setVendor('')
			return
		}
		if (!validateForm()) return toast.error('Данные не верны')
		if (hasDuplicateName()) return toast.error('Дубликат данных!')
		if (vendor)
			mutate({
				vendor,
				items: newCreate
			})
	}

	const { closeModal, isAnim } = useToggleModal({ onClose })

	if (!isOpen) return null

	return (
		<div
			className={`${styles.overlay} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
		>
			<div className={styles.content}>
				<div className={styles.form}>
					<div className={styles.scroll}>
						<Loader
							isLoading={isPending}
							type='pulsing'
							box
						/>
						<div className={styles.top}>
							<h1>Добавить накладную прихода</h1>
							<span onClick={() => closeModal()}>
								<X />
							</span>
						</div>
						<div className={styles.info}>
							<DefaultField
								id='vendor'
								label='Поставщик'
								placeholder='* Введите поставщика'
								type='text'
								value={vendor || ''}
								error={vendor === '' ? 'Не указан поставщик' : ''}
								onChange={e => setVendor(e.target.value)}
							/>
						</div>

						<div className={styles.box_position}>
							<h1>Позиции товаров</h1>
							<div className={styles.list}>
								{newCreate.length > 0 ? (
									newCreate.map((send, index) => (
										<div
											key={send.key}
											className={`${styles.product} ${checkDuplicateClass(send.name)}`}
										>
											{send.group === null ? (
												<div
													className={`${styles.body} ${styles.selected} ${getFieldError(index, 'name')}`}
												>
													<div className={styles.selected}>
														<button
															onClick={() => toggleGroup(send.key, 'new')}
														>
															Произвольный
														</button>
														<button
															onClick={() => toggleGroup(send.key, 'old')}
														>
															Существующий
														</button>
													</div>
													<Trash2
														onClick={() => handleDeleteProduct(send.key)}
														className={styles.del}
													/>
												</div>
											) : send.group === 'new' ? (
												<>
													<div
														className={`${styles.body} ${getFieldError(index, 'name')}`}
													>
														<Package />
														<DefaultField
															id={`name${index}`}
															name={`name${index}`}
															placeholder='* Название'
															value={send.name || ''}
															extra={styles.rField}
															onChange={e =>
																handleProductChange(
																	index,
																	'name',
																	e.target.value
																)
															}
														/>
														<Trash2
															onClick={() => handleDeleteProduct(send.key)}
															className={styles.del}
														/>
													</div>

													<div className={styles.micro}>
														<div
															className={`${styles.block} ${getFieldError(index, 'purchasePrice')}`}
														>
															<h1>Цена</h1>
															<div className={styles.field}>
																<BadgeDollarSign />
																<DefaultField
																	id={`purchasePrice${index}`}
																	name={`purchasePrice${index}`}
																	placeholder='* Количество'
																	value={send.purchasePrice || ''}
																	isNumber
																	extra={styles.rField}
																	onChange={e =>
																		handleProductChange(
																			index,
																			'purchasePrice',
																			+e.target.value
																		)
																	}
																/>
															</div>
														</div>
														<div
															className={`${styles.block} ${getFieldError(index, 'quantity')}`}
														>
															<h1>Количество</h1>
															<div className={styles.field}>
																<Coins />
																<DefaultField
																	id={`quantity${index}`}
																	name={`quantity${index}`}
																	placeholder='* Количество'
																	value={send.quantity || ''}
																	isNumber
																	extra={styles.rField}
																	onChange={e =>
																		handleProductChange(
																			index,
																			'quantity',
																			+e.target.value
																		)
																	}
																/>
															</div>
														</div>
													</div>
												</>
											) : (
												<>
													<div
														className={`${styles.body} ${getFieldError(index, 'name')}`}
													>
														<Package />
														<Select
															name='id'
															placeholder='* Выберите продукт'
															lodash
															pagination
															totalCount={totalCount}
															page={page}
															setPage={setPage}
															limit={limit}
															searchValue={searchValue}
															setSearchValue={setSearchValue}
															isFetching={isFetching}
															onSearchChange={setSearch}
															setData={values => {
																handleProductChange(
																	index,
																	'id',
																	`${values[0].value}`
																)
																handleProductChange(
																	index,
																	'name',
																	`${values[0].content}`
																)
																handleProductChange(
																	index,
																	'purchasePrice',
																	values[0].additionalData?.purchasePrice
																)
															}}
															extra={styles.rSelect}
															s_scrollHight={5}
														>
															{data?.map((product, index) => (
																<OptionSpan
																	key={`${product.id}-${index}-product`}
																	value={`${product.id}`}
																	content={product.name}
																	additionalData={{
																		purchasePrice: product.purchasePrice
																	}}
																	span={
																		<div className={styles.rSpan}>
																			<span
																				className={styles.price}
																			>{`${product?.purchasePrice} тг`}</span>
																		</div>
																	}
																/>
															))}
														</Select>
														<Trash2
															onClick={() => handleDeleteProduct(send.key)}
															className={styles.del}
														/>
													</div>

													<div className={styles.micro}>
														<div
															className={`${styles.block} ${getFieldError(index, 'quantity')}`}
														>
															<div className={styles.field}>
																<Coins />
																<DefaultField
																	id={`quantity${index}`}
																	name={`quantity${index}`}
																	placeholder='* Количество'
																	value={send.quantity || ''}
																	isNumber
																	extra={styles.rField}
																	onChange={e =>
																		handleProductChange(
																			index,
																			'quantity',
																			+e.target.value
																		)
																	}
																/>
															</div>
														</div>
													</div>
												</>
											)}
										</div>
									))
								) : (
									<div className={styles.not_found}>
										<p>Добавьте позицию для начало</p>
									</div>
								)}
							</div>
						</div>

						<div className={styles.buttons}>
							<button
								type='button'
								onClick={addProduct}
								disabled={isPending}
							>
								Добавить
							</button>
							<button
								type='submit'
								onClick={() => handleMutate()}
								disabled={newCreate.length === 0 || isPending}
								className={styles.send}
							>
								Отправить
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
