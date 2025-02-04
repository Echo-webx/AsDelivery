'use client'

import { CircuitBoard, Info, UserRound, X } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

import { EnumUserRole } from '@/types/user.types'

import { useProfileStore } from '@/store/useProfileStore'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import { formatDayJs } from '@/utils/dateHelpers'
import { formatNumber } from '@/utils/formatters'

import styles from './Profile.module.scss'

export function Profile() {
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { data } = useProfileStore()

	const { closeModal, openModal, isAnim, isOpen } = useToggleModal({})
	useClickOutside(modalRef, () => closeModal())

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<div className={styles.img}>
					<Image
						alt='profile-background'
						src={'/images/profile-background.webp'}
						fill={true}
						priority={true}
						sizes='(max-width: 1080px) 100vw, (max-width: 1920px) 100vw, 100vw'
					/>
				</div>
				<div className={styles.form}>
					<div className={styles.avatar}>
						<UserRound size={70} />
					</div>
					<div className={styles.info}>
						<div
							onClick={() => openModal()}
							className={styles.moreBtn}
						>
							<Info size={18} />
							<p>Дополнительно</p>
						</div>
						<p
							className={styles.name}
						>{`${data?.info?.name} ${data?.info?.surname.charAt(0)}. ${data?.info?.patronymic.charAt(0)}.`}</p>
						<p>Должность: {data?.info?.jobPosition || 'не указана'}</p>

						<p>Создан {formatDayJs('standard', data?.createdAt)}</p>
					</div>
				</div>
			</div>
			<div className={styles.form}>
				<div className={styles.chart}>
					<div className={styles.info}>
						<p className='flex gap-1'>
							<CircuitBoard />
							Скоро тут появится статистика
						</p>
					</div>
					<div className={styles.line} />
				</div>
			</div>

			{isOpen && (
				<>
					<div
						ref={modalRef}
						className={`${styles.more} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
					>
						<div className={styles.form}>
							<div className={styles.top}>
								<h1>Информация о пользователе</h1>
								<X
									size={12}
									onClick={() => closeModal()}
								/>
							</div>
							<div className={styles.bottom}>
								<div>
									<p>Email: {data?.email || 'не указан'}</p>
									{data?.role === EnumUserRole.default && (
										<p>{`Заработная плата: ${data?.wages ? formatNumber(data?.wages) + ' тг' : 'не указана'}`}</p>
									)}
								</div>

								<div className={styles.date}>
									<span>
										<p>Дата регистрации </p>
										<p>{formatDayJs('D_MMMM_YYYY', data?.createdAt)}</p>
									</span>
									<span>
										<p>День рождения </p>
										<p>{formatDayJs('D_MMMM_YYYY', data?.info?.birthday)}</p>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div
						className={`${styles.moreBg} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
					></div>
				</>
			)}
		</div>
	)
}
