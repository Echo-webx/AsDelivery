import { type FocusEvent, type KeyboardEvent, forwardRef } from 'react'

import styles from './AuthField.module.scss'

interface InputFieldsProps {
	id: string
	type?: string
	label: string
	minLength?: number
	maxLength?: number
	placeholder: string
	disabled?: boolean
	error?: string
	defaultValue?: string | number
	isNumber?: boolean
	extra?: string
}

export const AuthField = forwardRef<HTMLInputElement, InputFieldsProps>(
	(
		{
			label,
			id,
			type,
			disabled,
			error,
			minLength,
			maxLength,
			placeholder,
			defaultValue,
			isNumber,
			extra,
			...rest
		},
		ref
	) => {
		const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
			const inputValue = event.currentTarget.value
			const hasMinus = inputValue.includes('-')
			const caretPosition = event.currentTarget.selectionStart || 0

			// Разрешаем только Backspace, Tab, Enter, стрелки и цифры
			const validKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight']

			// Если это одна из управляющих клавиш (стрелки, Backspace и т.д.), разрешаем их
			if (validKeys.includes(event.key)) {
				return
			}

			if (isNumber) {
				// Если вводим минус:
				if (event.key === '-') {
					// Если минуса еще нет, позволяем вводить его только в начало
					if (!hasMinus && caretPosition === 0) {
						return
					}
					// Если минус уже есть, блокируем его ввод
					event.preventDefault()
					return
				}

				// Блокируем ввод цифр перед минусом, но оставляем стрелки активными
				if (hasMinus && caretPosition <= inputValue.indexOf('-')) {
					event.preventDefault()
					return
				}

				// Разрешаем только цифры
				if (!/[0-9]/.test(event.key)) {
					event.preventDefault()
				}
			}
		}

		const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
			if (isNumber && event.target.value === '0') {
				event.target.value = ''
			}
		}

		const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
			const value = event.target.value

			if (isNumber) {
				if (value === '') {
					event.target.value = '0'
					return
				}

				// Удаляем лишние нули в начале
				const cleanedValue = value.replace(/^(-?)0+(?!$)/, '$1')
				event.target.value = cleanedValue
			}
		}

		return (
			<div className={`${extra}`}>
				<label
					htmlFor={id}
					className={`${styles.label} ${error && styles.error}`}
				>
					{error ? error : label}
				</label>
				<input
					ref={ref}
					id={id}
					type={type}
					disabled={disabled}
					minLength={minLength}
					maxLength={maxLength}
					placeholder={placeholder}
					defaultValue={defaultValue}
					className={`${styles.input} ${error && styles.error}`}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
					onFocus={handleFocus}
					{...rest}
				/>
			</div>
		)
	}
)
