import {
	BotOff,
	ChevronDown,
	ChevronUp,
	CircleCheck,
	Disc3,
	Info
} from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

import { Loader } from '@/components/loader/Loader'

import type { IProductReception } from '@/types/reception.types'

import { CORE_PAGES } from '@/config/pages-url.config'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import styles from '../../widgets/reception/TotalReception.module.scss'

interface Props {
	isLoading: boolean
	isFetching: boolean
	data?: IProductReception[]
	editReceptions?: IProductReception[]
}

export function TotalReceptionWarn({
	isLoading,
	isFetching,
	data,
	editReceptions
}: Props) {
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, toggleModal, isAnim, isOpen } = useToggleModal({})
	useClickOutside(modalRef, () => closeModal())

	return (
		<div
			className={`${styles.warn_reception} ${
				!isLoading && !isFetching
					? editReceptions && editReceptions.length > 0
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
						disabled={editReceptions?.length === 0}
						className={styles.info}
					>
						{editReceptions && editReceptions.length > 0 ? (
							<>
								<Info size={20} />
								<p>{`Найдено ${editReceptions.length} исправлений`}</p>
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

					{editReceptions && isOpen && (
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
							{editReceptions.map(rel => (
								<Link
									href={`${CORE_PAGES.YIELDS}/${CORE_PAGES.RECEPTION}/${rel.id}`}
									key={rel.id}
									className={styles.item}
								>
									<Disc3 size={20} />
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
