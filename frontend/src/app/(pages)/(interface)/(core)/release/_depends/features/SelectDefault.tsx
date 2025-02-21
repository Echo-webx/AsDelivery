import { Settings } from 'lucide-react'
import { type Dispatch, type SetStateAction, useRef } from 'react'

import { DefaultField } from '@/components/ui/fields/DefaultField'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import type { SettingsSelect } from '../Release'
import styles from '../Release.module.scss'

interface Props {
	isSetSelect: SettingsSelect
	setIsSetSelect: Dispatch<SetStateAction<SettingsSelect>>
	date: string
	setDate: Dispatch<SetStateAction<string>>
	dateTo: string | null
	setDateTo: Dispatch<SetStateAction<string | null>>
}

export function SelectDefault({
	isSetSelect,
	setIsSetSelect,
	date,
	setDate,
	dateTo,
	setDateTo
}: Props) {
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, toggleModal, isAnim, isOpen } = useToggleModal({})
	useClickOutside(modalRef, () => closeModal())

	return (
		<>
			<div className={styles.select_report}>
				{isSetSelect === 'standard' ? (
					<div className={styles.flex}>
						<DefaultField
							id='date'
							type='date'
							placeholder='Выберите дату'
							defaultValue={date}
							extra={styles.rField}
							onChange={e => setDate(e.target.value)}
						/>
						<button
							onClick={() => toggleModal()}
							className={styles.btn}
						>
							<Settings size={27} />
						</button>
					</div>
				) : (
					<div className={styles.flex}>
						<DefaultField
							id='date'
							type='date'
							placeholder='Выберите дату'
							defaultValue={date}
							extra={styles.rField}
							onChange={e => setDate(e.target.value)}
						/>
						<DefaultField
							id='dateTo'
							type='date'
							placeholder='Выберите дату'
							defaultValue={dateTo || ''}
							extra={styles.rField}
							onChange={e => setDateTo(e.target.value)}
						/>

						<button
							onClick={() => toggleModal()}
							className={styles.btn}
						>
							<Settings size={27} />
						</button>
					</div>
				)}

				{isOpen && (
					<div
						ref={modalRef}
						className={`${styles.settings} ${isAnim ? styles.fadeOut : styles.fadeIn}`}
					>
						<button
							onClick={() => (
								setDateTo(null), setIsSetSelect('standard'), closeModal()
							)}
							className={isSetSelect === 'standard' ? styles.active : ''}
						>
							Стандартный: по дате
						</button>
						<button
							onClick={() => {
								setDateTo(date), setIsSetSelect('extended'), closeModal()
							}}
							className={isSetSelect === 'extended' ? styles.active : ''}
						>
							Расширенный: по дате от/до
						</button>
					</div>
				)}
			</div>
		</>
	)
}
