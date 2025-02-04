import {
	BadgeDollarSign,
	BadgePercent,
	Package,
	Paperclip,
	Recycle,
	Trash2
} from 'lucide-react'
import { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { OptionSpan } from '@/components/ui/select/element/OptionSpan'

import type { IAddress } from '@/types/address.types'

import useToast from '@/hooks/useToast'

import styles from './FormCreate.module.scss'
import { useArray } from './hooks/useArray'
import { useReleaseCreate } from './hooks/useCreate'
import { useValidError } from './hooks/useValidError'
import { useWorkload } from './hooks/useWorkload'

export interface NewCreate {
	key: string
	id: string
	linkId: string
	group: 'category' | 'product' | null
	name: string
	quantitySale: number
	quantitySwap: number
	quantityBonus: number
}

interface Props {
	address: IAddress
}

export function FormCreate({ address }: Props) {
	const [newCreate, setNewCreate] = useState<NewCreate[]>([
		{
			key: uuidV4(),
			id: '',
			linkId: '',
			group: null,
			name: '',
			quantitySale: 0,
			quantitySwap: 0,
			quantityBonus: 0
		}
	])

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [search, setSearch] = useState('')
	const [searchValue, setSearchValue] = useState('')

	const { addProduct, clearProduct, handleProductChange, handleDeleteProduct } =
		useArray({
			newCreate,
			setNewCreate
		})

	const { getFieldError, validateForm, checkDuplicateClass, hasDuplicateIds } =
		useValidError({ newCreate, styles })

	const { toast } = useToast()

	const { data, isFetching, totalCount } = useWorkload(page, limit, search)

	const { mutate, isPending } = useReleaseCreate({ clearProduct })

	const handleMutate = () => {
		if (!validateForm()) return toast.error('Данные не верны')
		if (hasDuplicateIds()) return toast.error('Дубликат данных!')

		mutate({
			addressId: address.id,
			items: newCreate
		})
	}

	return (
		<>
			<div className={styles.box_position}>
				<div className={styles.top}>
					<h1>Отправка отчета выгрузки</h1>
				</div>

				<div className={styles.relative}>
					<Loader
						isLoading={isPending}
						type='pulsing'
						box
						notShadow
					/>
					<div className={styles.list}>
						{newCreate.length > 0 ? (
							newCreate.map((send, index) => (
								<div
									key={send.key}
									className={`${styles.product} ${checkDuplicateClass(send.id)}`}
								>
									<div
										className={`${styles.body} ${getFieldError(index, 'id')}`}
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
												handleProductChange(index, 'id', `${values[0].value}`)
												handleProductChange(
													index,
													'name',
													`${values[0].content}`
												)
												handleProductChange(
													index,
													'linkId',
													values[0].additionalData?.linkId
												)
												handleProductChange(
													index,
													'group',
													values[0].additionalData?.group
												)
											}}
											extra={styles.rSelect}
											s_scrollHight={5}
										>
											{data?.map((product, index) =>
												product.visible ? (
													<OptionSpan
														key={`${product.id}-${index}-product`}
														value={`${product.id}`}
														content={product.name}
														additionalData={{
															linkId: product.linkUsers[0].id,
															group: 'product'
														}}
														span={
															<div className={styles.rSpan}>
																<span>{`${product?.salePrice} тг`}</span>
																<span
																	className={`${styles.count} ${
																		product.linkUsers[0].count > 0
																			? styles.green
																			: product.linkUsers[0].count < 0
																				? styles.red
																				: ''
																	}`}
																>
																	{product.linkUsers[0].count}
																</span>
															</div>
														}
													/>
												) : (
													product.linkProducts.map((p, index) => (
														<OptionSpan
															key={`${p.product?.id}-${index}-product-category`}
															value={`${p.product?.id}`}
															content={`${p.product?.name}`}
															additionalData={{
																linkId: product.linkUsers[0].id,
																group: 'category'
															}}
															span={
																<div className={styles.rSpan}>
																	<span
																		className={styles.sale}
																	>{`${p.product?.salePrice} тг`}</span>
																	<span
																		className={`${styles.count} ${
																			product.linkUsers[0].count > 0
																				? styles.green
																				: product.linkUsers[0].count < 0
																					? styles.red
																					: ''
																		}`}
																	>
																		{product.linkUsers[0].count}
																	</span>
																</div>
															}
															svg={<Paperclip size={20} />}
														/>
													))
												)
											)}
										</Select>
										<Trash2
											onClick={() => handleDeleteProduct(send.key)}
											className={styles.del}
										/>
									</div>

									<div
										className={`${styles.micro} ${getFieldError(index, 'quantity')}`}
									>
										<div
											className={`${styles.block} ${getFieldError(index, 'quantitySale')}`}
										>
											<h1>Продажа</h1>
											<div className={styles.field}>
												<BadgeDollarSign />
												<DefaultField
													id={`quantitySale${index}`}
													name={`quantitySale${index}`}
													placeholder='* Количество'
													value={send.quantitySale || ''}
													isNumber
													extra={styles.rField}
													onChange={e =>
														handleProductChange(
															index,
															'quantitySale',
															+e.target.value
														)
													}
												/>
											</div>
										</div>
										<div
											className={`${styles.block} ${getFieldError(index, 'quantitySwap')}`}
										>
											<h1>Обмен</h1>
											<div className={styles.field}>
												<Recycle />
												<DefaultField
													id={`quantitySwap${index}`}
													name={`quantitySwap${index}`}
													placeholder='* Количество'
													value={send.quantitySwap || ''}
													isNumber
													extra={styles.rField}
													onChange={e =>
														handleProductChange(
															index,
															'quantitySwap',
															+e.target.value
														)
													}
												/>
											</div>
										</div>
										<div
											className={`${styles.block} ${getFieldError(index, 'quantityBonus')}`}
										>
											<h1>Бонус</h1>
											<div className={styles.field}>
												<BadgePercent />
												<DefaultField
													id={`quantityBonus${index}`}
													name={`quantityBonus${index}`}
													placeholder='* Количество'
													value={send.quantityBonus || ''}
													isNumber
													extra={styles.rField}
													onChange={e =>
														handleProductChange(
															index,
															'quantityBonus',
															+e.target.value
														)
													}
												/>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className={styles.not_found}>
								<p>Добавьте позицию для начало</p>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className={styles.buttons}>
				<button
					type='button'
					onClick={addProduct}
					disabled={isPending || isFetching}
				>
					Добавить
				</button>
				<button
					type='submit'
					onClick={() => handleMutate()}
					disabled={newCreate.length === 0 || isPending || isFetching}
					className={styles.send}
				>
					Отправить
				</button>
			</div>
		</>
	)
}
