'use client'

import Link from 'next/link'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { AuthField } from '@/components/ui/fields/AuthField'

import type { TypeReset } from '@/types/auth.types'

import { MAIN_PAGES } from '@/config/pages-url.config'

import styles from './Reset.module.scss'
import { useReset } from './hooks/useReset'

interface Props {
	token?: string
}

export function Reset({ token }: Props) {
	const {
		getValues,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<TypeReset>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useReset()

	const onSubmit: SubmitHandler<TypeReset> = data => {
		mutate({
			...data,
			token
		})
	}

	return (
		<main className={styles.main}>
			<form
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
			>
				<Loader
					isLoading={isPending}
					type='pulsing'
					box
				/>
				<h1 className={styles.top}>Восстановления пароля</h1>
				<AuthField
					id='password'
					label='Пароль'
					placeholder='* Введите пароль'
					type='password'
					extra='mb-1'
					error={errors.password?.message}
					{...register('password', {
						required: 'Требуется пароль',
						minLength: {
							value: 6,
							message: 'Минимум 6 символов'
						},
						maxLength: {
							value: 36,
							message: 'Максимум 36 символом'
						}
					})}
				/>
				<AuthField
					id='passwordConfirm'
					label='Подтвердить пароль'
					placeholder='* Введите подтверждения пароля'
					type='password'
					extra='mb-5'
					error={errors.passwordConfirm?.message}
					{...register('passwordConfirm', {
						required: 'Требуется подтверждения пароль',
						validate: value =>
							value === getValues('password') || 'Пароли не совпадают'
					})}
				/>

				<div className={styles.button}>
					<Link href={MAIN_PAGES.AUTH}>Вернуться</Link>
					<button type='submit'>Изменить пароль</button>
				</div>
			</form>
		</main>
	)
}
