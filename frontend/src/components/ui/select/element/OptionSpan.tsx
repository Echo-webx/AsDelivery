'use client'

import type { JSX } from 'react'

import type { OptionProps } from './Option'
import styles from './OptionSpan.module.scss'

export interface OptionSpanProps extends OptionProps {
	svg?: JSX.Element
	span?: JSX.Element
	extra?: string
}

export function OptionSpan({
	value,
	content,
	onClick,
	additionalData,
	span,
	svg,
	extra
}: OptionSpanProps) {
	return (
		<button
			type='button'
			className={styles.option}
			onClick={() => onClick && onClick({ value, content, additionalData })}
		>
			<div className={`${styles.item} ${extra}`}>
				{svg}
				<p>{content}</p>
				{span}
			</div>
		</button>
	)
}
