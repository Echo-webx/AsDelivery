'use client'

import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import { EnumUserRole, type TypeUserCreate } from '@/types/user.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalCreate.module.scss'
import { useUserCreate } from './hooks/useCreate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

export function ModalUserCreate({ isOpen, onClose }: ModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<TypeUserCreate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useUserCreate({
		reset
	})

	const onSubmit: SubmitHandler<TypeUserCreate> = data => {
		mutate({ ...data, checkRegion: data.checkRegion === 'true' })
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
						<h1 className={styles.top}>Создания пользователя</h1>
						<Select
							name='role'
							label='Роль'
							placeholder='* Выберите роль'
							extra={`mb-1 ${styles.rSelect}`}
							setValue={setValue}
							error={errors.role?.message}
							register={register('role', { required: 'Требуется роль' })}
						>
							<Option
								value={EnumUserRole.default}
								content='Обычная'
							/>
							<Option
								value={EnumUserRole.manager}
								content='Менеджер'
							/>
						</Select>
						<Select
							name='checkRegion'
							label='Проверка региона'
							placeholder='* Выберите проверку'
							extra={`mb-1 ${styles.rSelect}`}
							setValue={setValue}
							error={errors.checkRegion?.message}
							register={register('checkRegion', {
								required: 'Требуется проверка'
							})}
						>
							<Option
								value={'true'}
								content='Да, проверять'
							/>
							<Option
								value={'false'}
								content='Нет, игнорировать'
							/>
						</Select>
						<DefaultField
							id='birthday'
							label='День рождения'
							placeholder='* Введите день рождения'
							type='date'
							extra={`mb-1`}
							error={errors.birthday?.message}
							{...register('birthday', { required: 'Требуется день рождения' })}
						/>
						<DefaultField
							id='jobPosition'
							label='Должность'
							placeholder='* Введите должность'
							type='jobPosition'
							extra={`mb-1`}
							error={errors.jobPosition?.message}
							{...register('jobPosition', { required: 'Требуется должность' })}
						/>
						<DefaultField
							id='name'
							label='Имя'
							placeholder='* Введите имя'
							type='name'
							extra={`mb-1`}
							error={errors.name?.message}
							{...register('name', {
								required: 'Требуется имя'
							})}
						/>
						<DefaultField
							id='surname'
							label='Фамилия'
							placeholder='* Введите фамилию'
							type='surname'
							extra={`mb-1`}
							error={errors.surname?.message}
							{...register('surname', {
								required: 'Требуется фамилия'
							})}
						/>
						<DefaultField
							id='patronymic'
							label='Отчество'
							placeholder='* Введите отчество'
							type='patronymic'
							extra={`mb-1`}
							error={errors.patronymic?.message}
							{...register('patronymic', {
								required: 'Требуется отчество'
							})}
						/>
						<DefaultField
							id='email'
							label='Email'
							placeholder='* Введите Email'
							type='email'
							extra={`mb-3`}
							error={errors.email?.message}
							{...register('email', {
								required: 'Требуется Email',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Введите корректный Email'
								}
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
								Добавить
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
