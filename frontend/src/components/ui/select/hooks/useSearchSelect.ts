import debounce from 'lodash.debounce'
import {
	type ChangeEvent,
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useState
} from 'react'

interface Props {
	page?: number
	totalCount?: number
	limit?: number
	isFetching?: boolean
	lodash?: boolean
	setFilter: Dispatch<SetStateAction<string>>
	setSearchValue?: Dispatch<SetStateAction<string>>
	setPage?: Dispatch<SetStateAction<number>>
	onSearchChange?: Dispatch<SetStateAction<string>>
}

export function useSearchSelect({
	page,
	totalCount,
	limit,
	isFetching,
	lodash,
	setFilter,
	setSearchValue,
	setPage,
	onSearchChange
}: Props) {
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		if (!isFetching && totalCount !== undefined && page && limit) {
			if (totalCount <= 0) {
				setTotalPages(1)
				setPage?.(1)
			} else {
				const controlPage = Math.ceil(totalCount / limit)
				setTotalPages(controlPage)
				if (page > controlPage) {
					setPage?.(controlPage)
				}
			}
		}
	}, [isFetching, totalCount])

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			onSearchChange?.(value)
			setPage?.(1)
		}, 400),
		[]
	)

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setFilter(value)
		setSearchValue?.(value)

		if (lodash) {
			debouncedSearch(value)
		} else {
			onSearchChange?.(value)
		}
	}

	return {
		totalPages,
		handleInputChange
	}
}
