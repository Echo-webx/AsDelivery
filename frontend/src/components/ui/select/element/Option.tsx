'use client'

import type { JSX } from 'react'

import styles from './Option.module.scss'

export interface OptionProps {
	svg?: JSX.Element
	value: string | number
	content: string
	onClick?: (data: OptionProps & { additionalData?: any }) => void
	additionalData?: any
}

export interface OptionDataProps {
	value: string | number
	content: string
	additionalData?: any
}

export function Option({
	svg,
	value,
	content,
	onClick,
	additionalData
}: OptionProps) {
	return (
		<button
			type='button'
			className={styles.option}
			onClick={() => onClick && onClick({ value, content, additionalData })}
		>
			{svg}
			<p>{content}</p>
		</button>
	)
}
