import { Plus, TextSearch, X } from 'lucide-react'
import {
	Children,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	cloneElement,
	isValidElement,
	useEffect,
	useRef,
	useState
} from 'react'
import type { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'

import { useClickOutside } from '@/hooks/useClickOutside'

import styles from './Select.module.scss'
import type { OptionDataProps, OptionProps } from './element/Option'
import { PaginationSelect } from './element/Pagination'
import { useClickSelect } from './hooks/useClickSelect'
import { useDefaultSelect } from './hooks/useDefaultSelect'
import { useSearchSelect } from './hooks/useSearchSelect'
import { useToggleSelect } from './hooks/useToggleSelect'

interface StyleSelectProps {
	s_scrollHight?: number
	extra?: string
}

interface PaginationProps {
	pagination?: boolean
	totalCount?: number
	page?: number
	limit?: number
	setPage?: Dispatch<SetStateAction<number>>
}

interface AsyncSelectProps extends PaginationProps {
	defaultData?: OptionDataProps[]
	isFetching?: boolean
	lodash?: boolean
	register?: UseFormRegisterReturn
	setValue?: UseFormSetValue<any>
	onSearchChange?: Dispatch<SetStateAction<string>>
}

interface SelectProps extends StyleSelectProps, AsyncSelectProps {
	children: ReactNode
	name?: string
	type?: string
	label?: string
	placeholder: string
	multiple?: boolean
	search?: boolean
	searchValue?: string
	setSearchValue?: Dispatch<SetStateAction<string>>
	defaultValue?: string | number
	disabled?: boolean
	error?: string
	setValueData?: Dispatch<(string | number)[]>
	setData?: Dispatch<OptionDataProps[]>
}

export function Select({
	children,
	name,
	type,
	label,
	placeholder,
	multiple,
	search,
	searchValue,
	setSearchValue,
	defaultValue,
	disabled,
	error,
	setValueData,
	setData,
	defaultData,
	isFetching,
	lodash,
	register,
	setValue,
	onSearchChange,
	pagination,
	totalCount,
	page,
	setPage,
	limit,
	s_scrollHight,
	extra
}: SelectProps) {
	const [selectedValues, setSelectedValues] = useState<OptionDataProps[]>([])
	const [filter, setFilter] = useState('')
	const selectRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (selectedValues.length > 0) {
			setValueData?.(selectedValues.map(v => v.value))
			setData?.(selectedValues)
		}
	}, [selectedValues])

	// Установка значений по умолчанию
	useDefaultSelect({
		children,
		name,
		selectedValues,
		setSelectedValues,
		defaultValue,
		defaultData,
		setValue
	})

	const { isAnimSelect, isSelectOpen, toggleSelect } = useToggleSelect()
	useClickOutside(
		selectRef,
		() => toggleSelect(false),
		!isSelectOpen || isAnimSelect
	)

	// Обработка клика
	const { handleOptionClick, handleRemoveValue } = useClickSelect({
		selectedValues,
		setSelectedValues,
		toggleSelect,
		name,
		setValue,
		multiple
	})

	// Поиск
	const { totalPages, handleInputChange } = useSearchSelect({
		page,
		totalCount,
		limit,
		isFetching,
		lodash,
		setFilter,
		setPage,
		setSearchValue,
		onSearchChange
	})

	// Фильтрация опций при локальном поиске
	const availableOptions = Children.toArray(children).filter(child => {
		if (!isValidElement<OptionProps>(child)) return false

		const isExcluded = multiple
			? selectedValues.some(val => val.value === child.props.value)
			: false

		const matchesFilter = child.props.content
			.toLowerCase()
			.includes(filter.toLowerCase())

		return lodash ? !isExcluded : !isExcluded && matchesFilter
	})

	return (
		<div
			ref={selectRef}
			className={`${styles.selectContainer} ${extra}`}
		>
			{label && (
				<label
					onClick={() => toggleSelect(!isSelectOpen)}
					className={`${styles.label} ${error ? styles.error : ''}`}
				>
					{error ? error : label}
				</label>
			)}

			<div
				className={`${styles.select} ${label ? styles.labeling : ''}  ${error ? styles.error : ''} ${!multiple ? styles.activates : ''}`}
				onClick={() => {
					!multiple && toggleSelect(!isSelectOpen)
				}}
			>
				{multiple ? (
					<div className={styles.list}>
						<div
							className={styles.add}
							onClick={() => toggleSelect(!isSelectOpen)}
						>
							<Plus size={22} /> <p>{error || placeholder || 'Добавить'}</p>
						</div>
						{selectedValues.map(val => (
							<div
								key={`${val.value}-select`}
								className={styles.mSelected}
							>
								<p>{val.content}</p>
								<X
									size={24}
									onClick={() => handleRemoveValue(val.value)}
								/>
							</div>
						))}
					</div>
				) : (
					<p
						className={`${selectedValues.length === 0 ? styles.null : ''} ${error ? styles.error : ''}`}
					>
						{selectedValues[0]?.content || placeholder}
					</p>
				)}
			</div>

			<span
				className={`${styles.optionList} ${isSelectOpen ? styles.active : ''} ${
					isAnimSelect ? styles.fadeOut : styles.fadeIn
				}`}
			>
				{(search || lodash) && (
					<span className={styles.filter}>
						<TextSearch size={35} />
						<input
							type={type}
							disabled={disabled}
							placeholder={`${lodash ? 'Поиск по названию' : 'Фильтр по названию'}`}
							className={styles.filter}
							value={searchValue !== undefined ? searchValue : filter}
							onChange={handleInputChange}
						></input>
						{pagination && (
							<PaginationSelect
								isFetching={isFetching}
								page={page}
								setPage={setPage}
								totalPages={totalPages}
							/>
						)}
					</span>
				)}
				<div
					className={styles.scroll}
					style={{
						maxHeight: s_scrollHight && `${s_scrollHight * 35}px`
					}}
				>
					{!isFetching && availableOptions.length > 0 ? (
						availableOptions.map(child => {
							if (isValidElement<OptionProps>(child)) {
								return cloneElement(child, { onClick: handleOptionClick })
							}
							return null
						})
					) : (
						<div className={styles.noOptions}>
							{lodash ? (
								isFetching ? (
									<Loader
										type='dotted'
										isLoading={isFetching}
										box
										notShadow
									/>
								) : (
									'Нет результатов'
								)
							) : filter !== '' ? (
								'Не чего не найдено'
							) : (
								'Больше нечего выбрать'
							)}
						</div>
					)}
				</div>
			</span>

			<input
				type='hidden'
				{...register}
			/>
		</div>
	)
}
