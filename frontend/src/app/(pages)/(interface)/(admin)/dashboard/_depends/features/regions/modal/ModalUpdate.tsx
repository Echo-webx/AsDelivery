import { type Dispatch, type SetStateAction, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { MapMini } from '@/components/maps/MapMini'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import type { IRegion, TypeRegionUpdate } from '@/types/regions.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { useToggleModal } from '@/hooks/useToggleModal'

import { useAddress } from '../../../widgets/address/hooks/useAddress'
import { useProducts } from '../../products/main/hooks/useProduct'

import styles from './ModalUpdate.module.scss'
import { useRegionUpdate } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	region: IRegion | null
	setRegion: Dispatch<SetStateAction<IRegion | null>>
}

export function ModalRegionUpdate({
	isOpen,
	onClose,
	region,
	setRegion
}: ModalProps) {
	const [limit, setLimit] = useState(20)
	const [pageAddress, setPageAddress] = useState(1)
	const [searchAddress, setSearchAddress] = useState('')
	const [pageProduct, setPageProduct] = useState(1)
	const [searchProduct, setSearchProduct] = useState('')

	const {
		data: dataAddress,
		isFetching: isFetchingAddress,
		totalCount: totalCountAddress
	} = useAddress(pageAddress, limit, searchAddress)

	const {
		data: dataProduct,
		isFetching: isFetchingProduct,
		totalCount: totalCountProduct
	} = useProducts(pageProduct, limit, searchProduct)

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors }
	} = useForm<TypeRegionUpdate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useRegionUpdate()
	const { data } = useGeneralSettingsStore()

	const onSubmit: SubmitHandler<TypeRegionUpdate> = data => {
		if (region?.id) mutate({ id: region?.id, region: data })
	}

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setRegion(null), reset())
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
						<h1 className={styles.top}>Изменения региона</h1>
						<Select
							name='addressId'
							label='Адреса'
							placeholder='Выбрать'
							defaultData={region?.linkAddress.map(link => ({
								value: link.address?.id ?? '',
								content: link.address?.name ?? ''
							}))}
							setValue={setValue}
							multiple
							lodash
							pagination
							totalCount={totalCountAddress}
							page={pageAddress}
							limit={limit}
							setPage={setPageAddress}
							isFetching={isFetchingAddress}
							onSearchChange={setSearchAddress}
							error={errors.addressId?.message}
							extra={`mb-1`}
							s_scrollHight={5}
							register={register('addressId', { required: 'Требуются адреса' })}
						>
							{dataAddress?.map(address => (
								<Option
									key={address.id}
									value={address.id}
									content={address.name}
								/>
							))}
						</Select>
						<Select
							name='productsId'
							label='Продукты'
							placeholder='Выбрать'
							defaultData={region?.linkProducts.map(link => ({
								value: link.product?.id ?? '',
								content: link.product?.name ?? ''
							}))}
							setValue={setValue}
							multiple
							lodash
							pagination
							totalCount={totalCountProduct}
							page={pageProduct}
							limit={limit}
							setPage={setPageProduct}
							isFetching={isFetchingProduct}
							onSearchChange={setSearchProduct}
							error={errors.productsId?.message}
							extra={`mb-1`}
							s_scrollHight={5}
							register={register('productsId')}
						>
							{dataProduct?.map(product => (
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
							defaultValue={region?.name}
							extra={`mb-1`}
							error={errors.name?.message}
							{...register('name', {
								required: 'Требуется название'
							})}
						/>

						{data?.activeMap === 'true' ? (
							<div className={styles.form_map}>
								<h1 className={errors.position?.message && styles.error}>
									{errors.position?.message
										? errors.position.message
										: 'Центр региона'}
								</h1>
								<div className={styles.body}>
									<MapMini
										setValue={setValue}
										register={register('position', {
											required: 'Требуется центр'
										})}
										position={region?.position}
									/>
								</div>
							</div>
						) : (
							<div className={styles.no_activeMap}>
								<p>Карта деактивирована. Значения пропущены.</p>
							</div>
						)}

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
