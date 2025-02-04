import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react'

import type { ButtonDashboard } from '../Dashboard'

import styles from './ButtonList.module.scss'

interface Props {
	activeButton: ButtonDashboard
	setActiveButton: Dispatch<SetStateAction<ButtonDashboard>>
}
export function ButtonListDashboard({ activeButton, setActiveButton }: Props) {
	const buttonListRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const activeButton = buttonListRef.current?.querySelector(
			`.${styles.active}`
		)
		if (activeButton) {
			activeButton.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center'
			})
		}
	}, [activeButton])

	return (
		<div
			ref={buttonListRef}
			className={styles.button_list}
		>
			<button
				onClick={() => setActiveButton('general')}
				className={`${activeButton === 'general' ? styles.active : ''}`}
			>
				Общая настройка
			</button>
			<button
				onClick={() => setActiveButton('users')}
				className={`${activeButton === 'users' ? styles.active : ''}`}
			>
				Настройка пользователей
			</button>
			<button
				onClick={() => setActiveButton('regions')}
				className={`${activeButton === 'regions' ? styles.active : ''}`}
			>
				Настройка регионов
			</button>
			<button
				onClick={() => setActiveButton('address')}
				className={`${activeButton === 'address' ? styles.active : ''}`}
			>
				Настройка адресов
			</button>
			<button
				onClick={() => setActiveButton('products')}
				className={`${activeButton === 'products' ? styles.active : ''}`}
			>
				Настройка продуктов
			</button>
		</div>
	)
}
