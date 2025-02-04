'use client'

import { Coins, Package } from 'lucide-react'
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'

import type {
	IProductReception,
	TypeProductReceptionPositionUpdate
} from '@/types/reception.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalUpdate.module.scss'
import { useUpdateReception } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	reception?: IProductReception
}

export function ModalUpdateReception({
	isOpen,
	onClose,
	reception
}: ModalProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<TypeProductReceptionPositionUpdate>({
		mode: 'onChange',
		defaultValues: {
			position: reception?.position || []
		}
	})

	const { fields } = useFieldArray({
		name: 'position',
		control
	})

	const { mutate, isPending } = useUpdateReception()

	const onSubmit: SubmitHandler<TypeProductReceptionPositionUpdate> = data => {
		if (reception?.id)
			mutate({
				id: reception?.id,
				reception: data
			})
	}

	const { closeModal, isAnim } = useToggleModal({ onClose })

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
						<h1 className={styles.top}>Изменения позиций накладной</h1>

						<div className={styles.box_position}>
							<h1>Позиции товаров</h1>
							<div className={styles.list}>
								{reception?.position?.map((rel, index) => (
									<div
										key={rel.id}
										className={styles.product}
									>
										<div className={styles.body}>
											<Package />
											<p>{rel.name}</p>
										</div>

										<div className={styles.micro}>
											<div
												className={`${styles.block} ${
													errors.position &&
													errors.position[index]?.quantity?.message
														? styles.warn
														: ''
												}`}
											>
												<div className={styles.field}>
													<Coins />
													<DefaultField
														id={`position.${index}.quantitySale`}
														placeholder='* Количество'
														defaultValue={rel.quantity}
														isNumber
														extra={styles.rField}
														{...register(`position.${index}.quantity`, {
															required: 'Требуется количество',
															valueAsNumber: true,
															min: {
																value: -99999,
																message: 'Минимум 99999'
															},
															max: {
																value: 99999,
																message: 'Максимум 99999'
															}
														})}
													/>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className={styles.button}>
							<button
								type='button'
								disabled={isPending}
								onClick={() => closeModal()}
							>
								Вернуться
							</button>
							<button
								type='submit'
								disabled={isPending}
								className={styles.edit}
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
