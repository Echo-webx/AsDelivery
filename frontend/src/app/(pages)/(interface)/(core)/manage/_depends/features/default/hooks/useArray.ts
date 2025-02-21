import type { Dispatch, SetStateAction } from 'react'
import { v4 as uuidV4 } from 'uuid'

import type { NewCreate } from '../FormCreate'

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
				group: null,
				id: '',
				linkId: '',
				name: '',
				quantitySale: 0,
				quantitySwap: 0,
				quantityBonus: 0
			}
		])
	}

	const clearProduct = () => {
		setNewCreate([
			{
				key: uuidV4(),
				group: null,
				id: '',
				linkId: '',
				name: '',
				quantitySale: 0,
				quantitySwap: 0,
				quantityBonus: 0
			}
		])
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

	return { addProduct, clearProduct, handleProductChange, handleDeleteProduct }
}
