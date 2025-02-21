import debounce from 'lodash.debounce'
import {
	type ChangeEvent,
	type Dispatch,
	type SetStateAction,
	useCallback
} from 'react'

interface Props {
	setSearchQuery: Dispatch<SetStateAction<string>>
}

export function useSearch({ setSearchQuery }: Props) {
	const debouncedSearch = useCallback(
		debounce((query: string) => {
			setSearchQuery(query)
		}, 400),
		[]
	)

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		debouncedSearch(value)
	}

	return { handleSearchChange }
}
