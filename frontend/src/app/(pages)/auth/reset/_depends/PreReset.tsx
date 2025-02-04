'use client'

import Link from 'next/link'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { AuthField } from '@/components/ui/fields/AuthField'

import type { TypeEmail } from '@/types/auth.types'

import { MAIN_PAGES } from '@/config/pages-url.config'

import styles from './PreReset.module.scss'
import { usePreReset } from './hooks/usePreReset'

export function PreReset() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<TypeEmail>({
		mode: 'onChange'
	})

	const { mutate, isPending } = usePreReset()

	const onSubmit: SubmitHandler<TypeEmail> = data => {
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
				<h1 className={styles.top}>Восстановления пароля</h1>
				<AuthField
					id='email'
					label='Email'
					placeholder='* Введите Email'
					type='email'
					extra='mb-5'
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
					<Link href={MAIN_PAGES.AUTH}>Вернуться</Link>
					<button type='submit'>Отправить письмо</button>
				</div>
			</form>
		</main>
	)
}
