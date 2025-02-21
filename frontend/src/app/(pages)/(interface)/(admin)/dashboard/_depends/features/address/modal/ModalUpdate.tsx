import type { Dispatch, SetStateAction } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { MapMini } from '@/components/maps/MapMini'
import { DefaultField } from '@/components/ui/fields/DefaultField'

import type { IAddress, TypeAddressUpdate } from '@/types/address.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalUpdate.module.scss'
import { useAddressUpdate } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	address: IAddress | null
	setAddress: Dispatch<SetStateAction<IAddress | null>>
}

export function ModalAddressUpdate({
	isOpen,
	onClose,
	address,
	setAddress
}: ModalProps) {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors }
	} = useForm<TypeAddressUpdate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useAddressUpdate()
	const { data } = useGeneralSettingsStore()

	const onSubmit: SubmitHandler<TypeAddressUpdate> = data => {
		if (address?.id) mutate({ id: address?.id, address: data })
	}

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setAddress(null), reset())
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
						<h1 className={styles.top}>Изменения адреса</h1>

						<DefaultField
							id='name'
							label='Название'
							placeholder='* Введите название'
							type='name'
							defaultValue={address?.name}
							extra={`mb-3`}
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
										: 'Расположения адреса'}
								</h1>
								<div className={styles.body}>
									<MapMini
										setValue={setValue}
										register={register('position', {
											required: 'Требуется расположения'
										})}
										position={address?.position}
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
