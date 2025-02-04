'use client'

import { BadgeDollarSign, BadgePercent, Package, Recycle } from 'lucide-react'
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'

import type {
	IProductRelease,
	TypeProductReleasePositionUpdate
} from '@/types/release.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalUpdate.module.scss'
import { useReleaseUpdate } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	release?: IProductRelease
}

export function ModalReleaseUpdate({ isOpen, onClose, release }: ModalProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<TypeProductReleasePositionUpdate>({
		mode: 'onChange',
		defaultValues: {
			position: release?.position || []
		}
	})

	const { fields } = useFieldArray({
		name: 'position',
		control
	})

	const { mutate, isPending } = useReleaseUpdate()

	const onSubmit: SubmitHandler<TypeProductReleasePositionUpdate> = data => {
		if (release?.id)
			mutate({
				id: release?.id,
				release: data
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
								{release?.position?.map((rel, index) => (
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
													errors.position[index]?.quantitySale?.message
														? styles.warn
														: ''
												}`}
											>
												<h1>Продажа</h1>
												<div className={styles.field}>
													<BadgeDollarSign />
													<DefaultField
														id={`position.${index}.quantitySale`}
														placeholder='* Количество'
														defaultValue={rel.quantitySale}
														isNumber
														extra={styles.rField}
														{...register(`position.${index}.quantitySale`, {
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
											<div
												className={`${styles.block} ${
													errors.position &&
													errors.position[index]?.quantitySwap?.message
														? styles.warn
														: ''
												}`}
											>
												<h1>Обмен</h1>
												<div className={styles.field}>
													<Recycle />
													<DefaultField
														id={`position.${index}.quantitySwap`}
														placeholder='* Количество'
														defaultValue={rel.quantitySwap}
														isNumber
														extra={styles.rField}
														{...register(`position.${index}.quantitySwap`, {
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
											<div
												className={`${styles.block} ${
													errors.position &&
													errors.position[index]?.quantityBonus?.message
														? styles.warn
														: ''
												}`}
											>
												<h1>Бонус</h1>
												<div className={styles.field}>
													<BadgePercent />
													<DefaultField
														id={`quantityBonus${index}`}
														placeholder='* Количество'
														defaultValue={rel.quantityBonus}
														isNumber
														extra={styles.rField}
														{...register(`position.${index}.quantityBonus`, {
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
