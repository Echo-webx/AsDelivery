'use client'

import { Search, SunMoon } from 'lucide-react'
import { useRef } from 'react'

import { Loader } from '@/components/loader/Loader'

import { EnumUserRole } from '@/types/user.types'

import { useGeneralSettings } from '@/store/useGeneralStore'
import { useProfile } from '@/store/useProfileStore'

import { useClickOutside } from '@/hooks/useClickOutside'

import styles from './Navbar.module.scss'
import { SearchNavbar } from './components/SearchNavbar'
import { useActiveRegion } from './hooks/useActiveRegion'
import { useToggleNavbar } from './hooks/useToggleNavbar'

export function Navbar() {
	const searchRef = useRef<HTMLDivElement | null>(null)
	const themeRef = useRef<HTMLDivElement | null>(null)
	const regionRef = useRef<HTMLDivElement | null>(null)

	const { data, isLoading, isSuccess } = useProfile()
	const { data: dataGeneral } = useGeneralSettings()

	const {
		isAnimSearch,
		isAnimTheme,
		isAnimRegion,
		isSearchOpen,
		isThemeOpen,
		isRegionOpen,
		toggleSearch,
		toggleTheme,
		toggleRegion
	} = useToggleNavbar()

	useClickOutside(searchRef, () => toggleSearch(false))
	useClickOutside(themeRef, () => toggleTheme(false))
	useClickOutside(regionRef, () => toggleRegion(false))

	const { mutate, isPending } = useActiveRegion()

	const workTime = () => {
		if (!dataGeneral) return
		const currentTime = new Date().getHours()
		if (
			currentTime < dataGeneral.startWorking ||
			currentTime >= dataGeneral.endWorking
		)
			return false
		return true
	}

	return (
		<nav className={styles.navbar}>
			<span
				className={`${styles.indicator} ${
					data && data.role !== EnumUserRole.root
						? workTime() === true
							? data?.count < 0
								? styles.red
								: data?.count > 0
									? styles.green
									: styles.blue
							: ''
						: styles.blue
				}`}
			>
				{isLoading ? (
					<Loader
						isLoading={isLoading}
						type='dotted'
						box
						notBg
					/>
				) : isSuccess ? (
					data?.role === EnumUserRole.root ? (
						'Admin'
					) : data?.role === EnumUserRole.manager ? (
						'Manager'
					) : (
						(data?.count ?? 0)
					)
				) : (
					'Ошибка'
				)}
			</span>
			<div className={styles.button}>
				{data && data?.role !== EnumUserRole.root && (
					<div className={styles.relative}>
						<button
							onClick={() => toggleRegion(!isRegionOpen)}
							disabled={isPending}
							className={`${styles.toggleRegion} ${isRegionOpen && styles.active}`}
						>
							{isPending ? (
								<Loader
									isLoading={isPending}
									type='dotted'
									box
									notShadow
								/>
							) : isSuccess ? (
								<p>
									{data?.linkRegions.find(
										link => link.region?.id === data?.activeRegionId
									)?.region?.name || 'Не активен'}
								</p>
							) : (
								'Ошибка'
							)}
						</button>
						{isRegionOpen && (
							<div
								ref={regionRef}
								className={`${styles.region} ${isAnimRegion ? styles.fadeOut : styles.fadeIn}`}
							>
								<div className={styles.list}>
									{data &&
									data.linkRegions.filter(
										l => l.regionId !== data.activeRegionId
									).length > 0 ? (
										data?.linkRegions
											.filter(l => l.regionId !== data.activeRegionId)
											.map(link => (
												<button
													key={`${link.regionId}-toggle`}
													disabled={isPending}
													onClick={() => {
														mutate(link.regionId), toggleRegion(false)
													}}
												>
													<p>{link.region?.name}</p>
												</button>
											))
									) : (
										<button onClick={() => toggleRegion(false)}>
											<p>У вас нет регионов</p>
										</button>
									)}
								</div>
							</div>
						)}
					</div>
				)}

				<button
					onClick={() => toggleTheme(!isThemeOpen)}
					className={`${isThemeOpen && styles.active}`}
				>
					<SunMoon size={30} />
				</button>
				<button
					onClick={() => toggleSearch(!isSearchOpen)}
					className={`${isSearchOpen && styles.active}`}
				>
					<Search size={30} />
				</button>

				{isSearchOpen && (
					<>
						<SearchNavbar
							isSearchOpen={isSearchOpen}
							searchRef={searchRef}
							toggleSearch={toggleSearch}
							isAnimSearch={isAnimSearch}
						/>
					</>
				)}
				{isThemeOpen && (
					<div
						ref={themeRef}
						className={`${styles.theme} ${isAnimTheme ? styles.fadeOut : styles.fadeIn}`}
					>
						<button onClick={() => toggleTheme(false, 'system')}>
							Системная
						</button>
						<button onClick={() => toggleTheme(false, 'light')}>Светлая</button>
						<button onClick={() => toggleTheme(false, 'dark')}>Темная</button>
					</div>
				)}
			</div>
		</nav>
	)
}
