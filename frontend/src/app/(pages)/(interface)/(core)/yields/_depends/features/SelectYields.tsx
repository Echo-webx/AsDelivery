import { Settings } from 'lucide-react'
import { type Dispatch, type SetStateAction, useRef, useState } from 'react'

import { DefaultField } from '@/components/ui/fields/DefaultField'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import type { YieldsGroup } from '../Yields'
import styles from '../Yields.module.scss'

export type SettingsSelect = 'standard' | 'extended'

interface Props {
	activeGroup: YieldsGroup
	week: string
	setWeek: Dispatch<SetStateAction<string>>
	date: string
	setDate: Dispatch<SetStateAction<string>>
	dateTo: string | null
	setDateTo: Dispatch<SetStateAction<string | null>>
}

export function SelectYields({
	activeGroup,
	week,
	setWeek,
	date,
	setDate,
	dateTo,
	setDateTo
}: Props) {
	const [isSetSelect, setIsSetSelect] = useState<SettingsSelect>('standard')
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, toggleModal, isAnim, isOpen } = useToggleModal({})
	useClickOutside(modalRef, () => closeModal())

	return activeGroup === 'reception' ? (
		<div className={styles.select_report}>
			{isSetSelect === 'standard' ? (
				<div className={styles.flex}>
					<DefaultField
						id='date'
						type='date'
						placeholder='Выберите дату'
						extra={styles.rField}
						value={date}
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
						extra={styles.rField}
						onChange={e => setDate(e.target.value)}
						value={date}
					/>
					<DefaultField
						id='dateTo'
						type='date'
						placeholder='Выберите дату'
						extra={styles.rField}
						onChange={e => setDateTo(e.target.value)}
						value={dateTo || ''}
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
	) : (
		<div className={styles.select_report}>
			<div className={styles.flex}>
				<DefaultField
					id='week'
					type='week'
					placeholder='Выберите неделю'
					extra={styles.rField}
					onChange={e => setWeek(e.target.value)}
					value={week}
				/>
			</div>
		</div>
	)
}
