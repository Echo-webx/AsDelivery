'use client'

import Image from 'next/image'

import styles from './Developed.module.scss'

export function DevelopedPage() {
	return (
		<div className={styles.main}>
			<div className={styles.box}>
				<Image
					alt='developed'
					src={'/images/developed.webp'}
					fill={true}
					priority={true}
					sizes='(max-width: 1080px) 100vw, (max-width: 1920px) 100vw, 100vw'
				/>
				<h1>Страница в разработке</h1>
			</div>
		</div>
	)
}
