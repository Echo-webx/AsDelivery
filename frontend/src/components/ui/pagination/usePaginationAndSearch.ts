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
	page: number
	setPage: Dispatch<SetStateAction<number>>
	limit: number
	setSearch: Dispatch<SetStateAction<string>>
	totalCount?: number
	isFetching: boolean
}

export function usePaginationAndSearch({
	page,
	setPage,
	setSearch,
	totalCount,
	limit,
	isFetching
}: Props) {
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		if (!isFetching && totalCount !== undefined) {
			if (totalCount <= 0) {
				setTotalPages(1)
				setPage(1)
			} else {
				const controlPage = Math.ceil(totalCount / limit)
				setTotalPages(controlPage)
				if (page > controlPage) {
					setPage(controlPage)
				}
			}
		}
	}, [isFetching, totalCount])

	const debouncedSearch = useCallback(
		debounce((query: string) => {
			setSearch(query)
			setPage(1)
		}, 400),
		[]
	)

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		debouncedSearch(value)
	}

	return {
		totalPages,
		handleSearchChange
	}
}
