import type { Dispatch, SetStateAction } from 'react'
import { v4 as uuidV4 } from 'uuid'

import type { NewCreate } from '../modal/ModalCreate'

interface Props {
	newCreate: NewCreate[]
	setNewCreate: Dispatch<SetStateAction<NewCreate[]>>
}

export function useArray({ newCreate, setNewCreate }: Props) {
	const addProduct = () => {
		setNewCreate([
			...newCreate,
			{
				key: uuidV4(),
				name: '',
				quantity: 0,
				purchasePrice: 0,
				group: null
			}
		])
	}

	const clearProduct = () => {
		setNewCreate([
			{
				key: uuidV4(),
				name: '',
				quantity: 0,
				purchasePrice: 0,
				group: null
			}
		])
	}

	const toggleGroup = (key: string, group: 'new' | 'old') => {
		const updatedSend = newCreate.map(item =>
			item.key === key ? { ...item, group } : item
		)
		setNewCreate(updatedSend)
	}

	const handleProductChange = <K extends keyof NewCreate>(
		index: number,
		field: K,
		value: NewCreate[K]
	) => {
		const updatedSend = [...newCreate]
		updatedSend[index][field] = value
		setNewCreate(updatedSend)
	}

	const handleDeleteProduct = (key: string) => {
		setNewCreate(newCreate.filter(i => i.key !== key))
	}

	return {
		addProduct,
		clearProduct,
		toggleGroup,
		handleProductChange,
		handleDeleteProduct
	}
}
