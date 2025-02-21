export interface IRoot {
	id: string
	createdAt?: string
	updatedAt?: string
}

export type TypeSearch = {
	page: number
	limit: number
	search: string
}

export type TypeSearchIndex = {
	index: string
	date: string
	dateTo: string | null
}

export type TypeSearchDate = {
	date: string
	dateTo: string | null
}
