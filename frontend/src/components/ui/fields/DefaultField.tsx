import {
	type ChangeEvent,
	type FocusEvent,
	type KeyboardEvent,
	forwardRef
} from 'react'

import styles from './DefaultField.module.scss'

interface InputFieldsProps {
	id: string
	name?: string
	type?: string
	label?: string
	minLength?: number
	maxLength?: number
	placeholder: string
	disabled?: boolean
	error?: string
	defaultValue?: string | number
	value?: string | number
	isNumber?: boolean
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
	extra?: string
}

export const DefaultField = forwardRef<HTMLInputElement, InputFieldsProps>(
	(
		{
			label,
			id,
			name,
			type,
			disabled,
			error,
			minLength,
			maxLength,
			placeholder,
			defaultValue,
			value,
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

			const validKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight']
			if (validKeys.includes(event.key)) {
				return
			}

			if (isNumber) {
				if (
					(event.key === '.' || event.key === ',') &&
					caretPosition === 0 &&
					!hasMinus
				) {
					event.preventDefault()
					event.currentTarget.value = '-' + inputValue
					return
				}

				if (event.key === '-') {
					if (!hasMinus && caretPosition === 0) {
						return
					}
					event.preventDefault()
					return
				}
				if (hasMinus && caretPosition <= inputValue.indexOf('-')) {
					event.preventDefault()
					return
				}
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

				const cleanedValue = value.replace(/^(-?)0+(?!$)/, '$1')
				event.target.value = cleanedValue
			}
		}

		return (
			<div className={`${extra}`}>
				{label && (
					<label
						htmlFor={id}
						className={`${styles.label} ${error ? styles.error : ''}`}
					>
						{error ? error : label}
					</label>
				)}

				<input
					ref={ref}
					id={id}
					name={name}
					type={type}
					disabled={disabled}
					minLength={minLength}
					maxLength={maxLength}
					placeholder={placeholder}
					defaultValue={defaultValue}
					value={value}
					className={`${styles.input} ${label ? styles.labeling : ''} ${error ? styles.error : ''}`}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
					onFocus={handleFocus}
					pattern={isNumber ? '[0-9]*' : undefined}
					inputMode={isNumber ? 'numeric' : undefined}
					{...rest}
				/>
			</div>
		)
	}
)
