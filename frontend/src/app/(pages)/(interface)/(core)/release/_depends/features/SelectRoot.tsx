import { Album, CircleUser, Settings } from 'lucide-react'
import { type Dispatch, type SetStateAction, useRef, useState } from 'react'

import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'
import { OptionSpan } from '@/components/ui/select/element/OptionSpan'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useToggleModal } from '@/hooks/useToggleModal'

import { useUsersDefault } from '../../../_depends/useUsersDefault'
import type { SettingsSelect } from '../Release'
import styles from '../Release.module.scss'

interface Props {
	isSetSelect: SettingsSelect
	setIsSetSelect: Dispatch<SetStateAction<SettingsSelect>>
	date: string
	setDate: Dispatch<SetStateAction<string>>
	dateTo: string | null
	setDateTo: Dispatch<SetStateAction<string | null>>
	index: string
	setIndex: Dispatch<SetStateAction<string>>
}

export function SelectRoot({
	isSetSelect,
	setIsSetSelect,
	date,
	setDate,
	dateTo,
	setDateTo,
	index,
	setIndex
}: Props) {
	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const modalRef = useRef<HTMLDivElement | null>(null)

	const { closeModal, toggleModal, isAnim, isOpen } = useToggleModal({})
	useClickOutside(modalRef, () => closeModal())

	const { data, isFetching, totalCount } = useUsersDefault(page, limit, search)

	return (
		<>
			<div className={styles.select_report}>
				{isSetSelect === 'standard' ? (
					<>
						<div className={styles.flex}>
							<DefaultField
								id='date'
								type='date'
								placeholder='Выберите дату'
								defaultValue={date}
								extra={styles.rField}
								onChange={e => setDate(e.target.value)}
							/>
							<Select
								name='reportId'
								placeholder='* Выберите отчет'
								defaultValue={index}
								setValueData={e => setIndex(`${e[0]}`)}
								lodash
								pagination
								totalCount={totalCount}
								page={page}
								limit={limit}
								setPage={setPage}
								isFetching={isFetching}
								onSearchChange={setSearch}
								s_scrollHight={9}
								extra={styles.rSelect}
							>
								<Option
									content='Все накладные'
									value={'all'}
									svg={<Album size={20} />}
								/>
								{data?.map(user => (
									<OptionSpan
										key={`${user.id}-release`}
										value={user.id}
										content={`${user.info?.name} ${user.info?.surname} ${user.info?.patronymic}`}
										svg={<CircleUser size={20} />}
										span={
											<span
												className={`${styles.rSpan} ${
													user.count > 0
														? styles.green
														: user.count < 0
															? styles.red
															: ''
												}`}
											>{`${user.count}`}</span>
										}
									/>
								))}
							</Select>
							<button
								onClick={() => toggleModal()}
								className={styles.btn}
							>
								<Settings size={27} />
							</button>
						</div>
					</>
				) : (
					<>
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
						<Select
							name='reportId'
							placeholder='* Выберите отчет'
							defaultValue={index}
							setValueData={e => setIndex(`${e[0]}`)}
							lodash
							pagination
							totalCount={totalCount}
							page={page}
							limit={limit}
							setPage={setPage}
							isFetching={isFetching}
							onSearchChange={setSearch}
							s_scrollHight={9}
							extra={styles.rSelect}
						>
							<Option
								content='Все накладные'
								value={'all'}
								svg={<Album size={20} />}
							/>
							{data?.map(user => (
								<OptionSpan
									key={`${user.id}-release`}
									value={user.id}
									content={`${user.info?.name} ${user.info?.surname} ${user.info?.patronymic}`}
									svg={<CircleUser size={20} />}
									span={
										<span
											className={`${styles.rSpan} ${
												user.count > 0
													? styles.green
													: user.count < 0
														? styles.red
														: ''
											}`}
										>{`${user.count}`}</span>
									}
								/>
							))}
						</Select>
					</>
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
