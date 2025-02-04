'use client'

import {
	DiamondPlus,
	House,
	Menu,
	Newspaper,
	NotebookText,
	User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

import { Loader } from '@/components/loader/Loader'

import { EnumUserRole } from '@/types/user.types'

import {
	ADMIN_PAGES,
	CORE_PAGES,
	MAIN_PAGES,
	PROFILE_PAGES
} from '@/config/pages-url.config'

import { useProfileStore } from '@/store/useProfileStore'

import { useClickOutside } from '@/hooks/useClickOutside'

import styles from './Footer.module.scss'
import { LogoutButton } from './components/LogoutButton'
import { useToggleFooter } from './useToggleFooter'

export function Footer() {
	const menuRef = useRef<HTMLSpanElement | null>(null)

	const pathname = usePathname()

	const { data, isLoading, isSuccess } = useProfileStore()

	const { isAnimMenu, isMenuOpen, toggleMenu } = useToggleFooter()
	useClickOutside(menuRef, () => toggleMenu(false))

	return (
		<footer className={styles.footer}>
			<Link
				href={MAIN_PAGES.HOME}
				className={`${pathname === MAIN_PAGES.HOME && styles.focus}`}
			>
				<House size={30} />
			</Link>
			<Link
				href={CORE_PAGES.MANAGE}
				className={`${pathname === CORE_PAGES.MANAGE && styles.focus}`}
			>
				<DiamondPlus size={30} />
			</Link>
			<Link
				href={CORE_PAGES.RELEASE}
				className={`${pathname === CORE_PAGES.RELEASE && styles.focus}`}
			>
				<NotebookText size={30} />
			</Link>
			{data && data?.role !== EnumUserRole.default && (
				<Link
					href={CORE_PAGES.YIELDS}
					className={`${pathname === CORE_PAGES.YIELDS && styles.focus}`}
				>
					<Newspaper size={30} />
				</Link>
			)}

			<button
				onClick={() => toggleMenu(!isMenuOpen)}
				className={`${isMenuOpen && styles.active}`}
			>
				<Menu size={30} />
			</button>
			{isMenuOpen && (
				<span
					ref={menuRef}
					className={`${styles.menu} ${isAnimMenu ? styles.fadeOut : styles.fadeIn}`}
				>
					<Link
						onClick={() => toggleMenu(false)}
						href={PROFILE_PAGES.MAIN}
						className={`${styles.profile} ${pathname === PROFILE_PAGES.MAIN && styles.focus}`}
					>
						{isLoading ? (
							<Loader
								isLoading={isLoading}
								type='dotted'
								box
							/>
						) : isSuccess ? (
							<>
								<span>
									<User size={30} />
								</span>
								<p>{`${data?.info?.name} ${data?.info?.surname.charAt(0)}. ${data?.info?.patronymic.charAt(0)}.`}</p>
							</>
						) : (
							<div className={styles.not_success}>
								<p>Ошибка загрузки</p>
							</div>
						)}
					</Link>
					{data?.role === EnumUserRole.root && (
						<>
							<Link
								onClick={() => toggleMenu(false)}
								href={ADMIN_PAGES.MAIN}
								className={`${styles.link} ${pathname === ADMIN_PAGES.MAIN && styles.focus}`}
							>
								Панель управления
							</Link>
						</>
					)}

					<LogoutButton extra={`${styles.link} ${styles.logout}`}>
						Выйти из аккаунта
					</LogoutButton>
				</span>
			)}
		</footer>
	)
}
