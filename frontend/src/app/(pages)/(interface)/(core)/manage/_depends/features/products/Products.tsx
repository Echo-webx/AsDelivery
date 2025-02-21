import { Boxes, Coins, GitBranchPlus, Package, Trash2 } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { OptionSpan } from '@/components/ui/select/element/OptionSpan'

import type { IUser } from '@/types/user.types'

import useToast from '@/hooks/useToast'

import { formatDayJs } from '@/utils/dateHelpers'

import styles from './Products.module.scss'
import { useArray } from './hooks/useArray'
import { useValidError } from './hooks/useValidError'
import { useWorkloadForUser } from './hooks/useWorkloadForUser'
import { useWorkloadSend } from './hooks/useWorkloadSend'
import { useWorkloadUser } from './hooks/useWorkloadUser'

export type GroupDefault = 'product' | 'region' | null

interface Props {
	setActiveGroup?: Dispatch<SetStateAction<GroupDefault>>
	user: IUser
}

export interface NewProduct {
	key: string
	id: string
	linkId: string
	group: 'category' | 'product' | null
	name: string
	count: number
	updatedAt?: string
}

export function ManageProducts({ setActiveGroup, user }: Props) {
	const [newProducts, setNewProducts] = useState<NewProduct[]>([])

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [search, setSearch] = useState('')
	const [searchValue, setSearchValue] = useState('')

	const {
		data: dataItems,
		totalCount,
		isFetching: isFetchingItems
	} = useWorkloadForUser(user.id, page, limit, search)

	const { addProduct, handleProductChange, handleDeleteProduct } = useArray({
		newProducts,
		setNewProducts
	})

	const { getFieldError, validateForm, checkDuplicateClass, hasDuplicateIds } =
		useValidError({ newProducts, styles })

	const { toast } = useToast()

	const { data, isLoading, isSuccess, isFetching } = useWorkloadUser(user.id)

	useEffect(() => {
		if (isSuccess && !isFetching && data) {
			setNewProducts(
				data.map(item => ({
					key: uuidV4(),
					id: item.id,
					linkId: item.linkUsers[0].id,
					group: item.visible ? 'product' : 'category',
					name: item.name,
					count: item.linkUsers[0].count,
					updatedAt: item.linkUsers[0].updatedAt
				}))
			)
		}
	}, [isSuccess, isFetching])

	const { mutate, isPending } = useWorkloadSend()

	const handleMutate = () => {
		if (!validateForm()) return toast.error('Данные не верны')
		if (hasDuplicateIds()) return toast.error('Дубликат данных!')

		mutate({
			userId: user.id,
			items: newProducts
		})
	}

	return (
		<>
			<div className={styles.box_products}>
				<div className={styles.top}>
					<h1>Погрузка пользователя</h1>
					{setActiveGroup && (
						<button onClick={() => setActiveGroup('region')}>
							<GitBranchPlus size={22} /> Привязка
						</button>
					)}
				</div>

				<div className={styles.relative}>
					<Loader
						isLoading={isPending}
						type='pulsing'
						box
						notShadow
					/>
					<div className={styles.list}>
						{isLoading || isFetching ? (
							<Loader
								isLoading={isLoading || isFetching}
								type='dotted'
								box
								notShadow
							/>
						) : isSuccess ? (
							newProducts.length > 0 ? (
								newProducts.map((item, index) => (
									<div
										key={item.key}
										className={`${styles.product} ${checkDuplicateClass(item.id)}`}
									>
										<div
											className={`${styles.body} ${getFieldError(index, 'id')}`}
										>
											{item.group === 'category' ? <Boxes /> : <Package />}
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
												isFetching={isFetchingItems}
												onSearchChange={setSearch}
												defaultData={[
													{
														value: item.id,
														content: item.name,
														additionalData: {
															linkId: item.linkId,
															group: item.group
														}
													}
												]}
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
												{dataItems?.map((product, index) =>
													product.visible ? (
														<OptionSpan
															key={`${product.id}-${index}-product`}
															value={`${product.id}`}
															content={product.name}
															additionalData={{
																linkId: product.linkUsers?.[0]?.id,
																group: 'product'
															}}
															span={
																<div className={styles.rSpan}>
																	<span>{`${product?.salePrice} тг`}</span>
																</div>
															}
															svg={<Package size={20} />}
														/>
													) : (
														<OptionSpan
															key={`${product?.id}-${index}-product-category`}
															value={`${product?.id}`}
															content={`${product?.name}`}
															additionalData={{
																linkId: product.linkUsers?.[0]?.id,
																group: 'category'
															}}
															svg={<Boxes size={20} />}
														/>
													)
												)}
											</Select>
											<Trash2
												onClick={() => handleDeleteProduct(item.key)}
												className={styles.del}
											/>
										</div>

										<div
											className={`${styles.micro} ${getFieldError(index, 'count')}`}
										>
											<div className={styles.left}>
												<Coins />
												<DefaultField
													id={`count${index}`}
													name={`count${index}`}
													placeholder='* Количество'
													value={item.count || ''}
													isNumber
													extra={styles.rField}
													onChange={e =>
														handleProductChange(index, 'count', +e.target.value)
													}
												/>
											</div>

											<div className={styles.right}>
												<span>
													{formatDayJs(
														'D_MMMM_YYYY, HH:mm',
														item.updatedAt,
														'В обработке'
													)}
												</span>
											</div>
										</div>
									</div>
								))
							) : (
								<div className={styles.not_found}>
									Добавьте позицию для начало
								</div>
							)
						) : (
							<div className={styles.not_success}>Ошибка загрузки</div>
						)}
					</div>
				</div>
			</div>
			<div className={styles.buttons}>
				<button
					type='button'
					disabled={isPending || isFetching}
					onClick={addProduct}
				>
					Добавить
				</button>
				<button
					type='submit'
					onClick={() => handleMutate()}
					disabled={isPending || isFetching}
					className={styles.send}
				>
					Отправить
				</button>
			</div>
		</>
	)
}
