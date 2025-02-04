'use client'

import { useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import type { IGeneral, TypeGeneral } from '@/types/general.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalUpdate.module.scss'
import { useGeneralUpdate } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	data?: IGeneral
}

export function ModalGeneralUpdate({ isOpen, onClose, data }: ModalProps) {
	const modalRef = useRef<HTMLDivElement | null>(null)

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors }
	} = useForm<TypeGeneral>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useGeneralUpdate()

	const onSubmit: SubmitHandler<TypeGeneral> = data => {
		const formData = {
			...data,
			activeMap: data.activeMap === 'true'
		}
		mutate(formData)
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
			<div
				ref={modalRef}
				className={styles.content}
			>
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
						<h1 className={styles.top}>Изменения настроек</h1>

						<Select
							name='activeMap'
							label='Активность карты'
							placeholder='* Выберите активность'
							setValue={setValue}
							defaultValue={`${data?.activeMap}`}
							error={errors.activeMap?.message}
							extra={`mb-2 ${styles.rSelect}`}
							register={register('activeMap', {
								required: 'Требуется активность'
							})}
						>
							<Option
								value={'true'}
								content='Активна'
							/>
							<Option
								value={'false'}
								content='Не активна'
							/>
						</Select>

						<DefaultField
							id='startWorking'
							label='Начало рабочего дня'
							placeholder='* Введите начало дня'
							type='startWorking'
							isNumber
							defaultValue={data?.startWorking}
							extra={`mb-2`}
							error={errors.startWorking?.message}
							{...register('startWorking', {
								required: 'Требуется начало дня',
								valueAsNumber: true,
								min: {
									value: 1,
									message: 'Минимум 1'
								},
								max: {
									value: 24,
									message: 'Максимум 24'
								}
							})}
						/>

						<DefaultField
							id='endWorking'
							label='Конец рабочего дня'
							placeholder='* Введите конец дня'
							type='endWorking'
							isNumber
							defaultValue={data?.endWorking}
							extra={`mb-4`}
							error={errors.endWorking?.message}
							{...register('endWorking', {
								required: 'Требуется конец дня',
								valueAsNumber: true,
								min: {
									value: 1,
									message: 'Минимум 1'
								},
								max: {
									value: 24,
									message: 'Максимум 24'
								}
							})}
						/>

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
								className={styles.register}
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
