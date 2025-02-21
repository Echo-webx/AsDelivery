'use client'

import Link from 'next/link'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { AuthField } from '@/components/ui/fields/AuthField'

import type { TypeLogin } from '@/types/auth.types'

import { MAIN_PAGES } from '@/config/pages-url.config'

import styles from './Auth.module.scss'
import { useLogin } from './hooks/useLogin'

export function Auth() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<TypeLogin>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useLogin()

	const onSubmit: SubmitHandler<TypeLogin> = data => {
		mutate(data)
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
				<h1 className={styles.top}>Авторизация</h1>
				<AuthField
					id='email'
					label='Email'
					placeholder='* Введите Email'
					type='email'
					extra='mb-2'
					error={errors.email?.message}
					{...register('email', {
						required: 'Требуется Email',
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: 'Введите корректный Email'
						}
					})}
				/>
				<AuthField
					id='password'
					label='Пароль'
					placeholder='* Введите пароль'
					type='password'
					extra='mb-5'
					error={errors.password?.message}
					{...register('password', {
						required: 'Требуется пароль',
						minLength: {
							value: 6,
							message: 'Минимум 6 символов'
						}
					})}
				/>

				<div className={styles.button}>
					<button type='submit'>Войти</button>
				</div>
				<div className={styles.reset}>
					<Link href={MAIN_PAGES.RESET}>Забыли пароль?</Link>
				</div>
			</form>
		</main>
	)
}
