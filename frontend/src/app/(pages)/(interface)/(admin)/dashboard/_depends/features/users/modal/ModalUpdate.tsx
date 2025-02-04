'use client'

import type { Dispatch, SetStateAction } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import {
	EnumUserRole,
	type IUser,
	type TypeUserUpdate
} from '@/types/user.types'

import { useToggleModal } from '@/hooks/useToggleModal'

import styles from './ModalUpdate.module.scss'
import { useUserUpdate } from './hooks/useUpdate'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	user: IUser | null
	setUser: Dispatch<SetStateAction<IUser | null>>
}

export function ModalUserUpdate({
	isOpen,
	onClose,
	user,
	setUser
}: ModalProps) {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors }
	} = useForm<TypeUserUpdate>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useUserUpdate()

	const onSubmit: SubmitHandler<TypeUserUpdate> = data => {
		if (user?.id)
			mutate({
				id: user?.id,
				user: { ...data, checkRegion: data.checkRegion === 'true' }
			})
	}

	const { closeModal, isAnim } = useToggleModal({
		onClose,
		callback: () => (setUser(null), reset())
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
						<h1 className={styles.top}>Изменения пользователя</h1>
						<Select
							name='role'
							label='Роль'
							placeholder='* Выберите роль'
							extra={`mb-1 ${styles.rSelect}`}
							setValue={setValue}
							defaultValue={user?.role}
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
							defaultValue={`${user?.checkRegion}`}
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
							defaultValue={
								user?.info?.birthday
									? user.info.birthday.split('T')[0]
									: undefined
							}
							extra={`mb-1`}
							error={errors.birthday?.message}
							{...register('birthday', { required: 'Требуется день рождения' })}
						/>
						<DefaultField
							id='jobPosition'
							label='Должность'
							placeholder='* Введите должность'
							type='jobPosition'
							defaultValue={user?.info?.jobPosition}
							extra={`mb-1`}
							error={errors.jobPosition?.message}
							{...register('jobPosition', { required: 'Требуется должность' })}
						/>
						<DefaultField
							id='name'
							label='Имя'
							placeholder='* Введите имя'
							type='name'
							defaultValue={user?.info?.name}
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
							defaultValue={user?.info?.surname}
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
							defaultValue={user?.info?.patronymic}
							extra={`mb-3`}
							error={errors.patronymic?.message}
							{...register('patronymic', {
								required: 'Требуется отчество'
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
