'use client'

import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { MapMini } from '@/components/maps/MapMini'
import { DefaultField } from '@/components/ui/fields/DefaultField'

import type { TypeAddressCreate } from '@/types/address.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalCreate.module.scss'
import { useAddressCreate } from './hooks/useCreate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

export function ModalAddressCreate({ isOpen, onClose }: ModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<TypeAddressCreate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useAddressCreate({
		reset
	})
	const { data } = useGeneralSettingsStore()

	const onSubmit: SubmitHandler<TypeAddressCreate> = rData => {
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
						<h1 className={styles.top}>Добавления адреса</h1>

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
									/>
								</div>
							</div>
						) : (
							<div className={styles.no_activeMap}>
								<p>
									Карта деактивирована. Будут использованы стандартные значения.
								</p>
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
								Добавить
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
