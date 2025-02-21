import {
	AlertTriangle,
	BotOff,
	ChevronDown,
	ChevronUp,
	CircleCheck,
	DiscAlbum,
	Info
} from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

import { Loader } from '@/components/loader/Loader'

import type { IProductRelease } from '@/types/release.types'

import { CORE_PAGES } from '@/config/pages-url.config'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import styles from '../../widgets/release/TotalRelease.module.scss'

interface Props {
	isLoading: boolean
	isFetching: boolean
	data?: IProductRelease[]
	errorReleases?: IProductRelease[]
	editReleases?: IProductRelease[]
}

export function TotalReleaseWarn({
	isLoading,
	isFetching,
	data,
	editReleases,
	errorReleases
}: Props) {
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, toggleModal, isAnim, isOpen } = useToggleModal({})
	useClickOutside(modalRef, () => closeModal())

	return (
		<div
			className={`${styles.warn_release} ${
				!isLoading && !isFetching
					? errorReleases && errorReleases.length > 0
						? styles.red
						: editReleases && editReleases.length > 0
							? styles.purple
							: data && data.length > 0
								? styles.green
								: ''
					: ''
			}`}
		>
			{isLoading || isFetching ? (
				<div className={styles.loader}>
					<Loader
						isLoading={isLoading || isFetching}
						type='dotted'
						box
						notShadow
					/>
				</div>
			) : (
				<>
					<button
						onClick={() => toggleModal()}
						disabled={errorReleases?.length === 0 && editReleases?.length === 0}
						className={styles.info}
					>
						{errorReleases && errorReleases?.length > 0 ? (
							<>
								<AlertTriangle size={20} />
								<p>{`Найдено ${errorReleases.length} нарушений`}</p>
								{isOpen && !isAnim ? <ChevronUp /> : <ChevronDown />}
							</>
						) : editReleases && editReleases.length > 0 ? (
							<>
								<Info size={20} />
								<p>{`Найдено ${editReleases.length} исправлений`}</p>
								{isOpen && !isAnim ? <ChevronUp /> : <ChevronDown />}
							</>
						) : data && data.length > 0 ? (
							<>
								<CircleCheck size={20} />
								<p>Нарушения отсутствуют</p>
							</>
						) : (
							<>
								<BotOff size={20} />
								<p>Нечего проверять</p>
							</>
						)}
					</button>

					{(errorReleases || editReleases) && isOpen && (
						<span
							ref={modalRef}
							className={`${styles.error_list} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
						>
							<Loader
								isLoading={isLoading || isFetching}
								type='dotted'
								box
								notShadow
							/>
							{errorReleases && errorReleases.length > 0
								? errorReleases?.map(rel => (
										<Link
											href={`${CORE_PAGES.RELEASE}/${rel.id}`}
											key={rel.id}
											className={styles.item}
										>
											<DiscAlbum size={20} />
											<p>{rel.tag}</p>
										</Link>
									))
								: editReleases?.map(rel => (
										<Link
											href={`${CORE_PAGES.RELEASE}/${rel.id}`}
											key={rel.id}
											className={styles.item}
										>
											<DiscAlbum size={20} />
											<p>{rel.tag}</p>
										</Link>
									))}
						</span>
					)}
				</>
			)}
		</div>
	)
}
