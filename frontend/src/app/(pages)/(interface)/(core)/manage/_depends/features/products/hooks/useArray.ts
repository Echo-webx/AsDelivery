import type { Dispatch, SetStateAction } from 'react'
import { v4 as uuidV4 } from 'uuid'

import type { NewProduct } from '../Products'

interface Props {
	newProducts: NewProduct[]
	setNewProducts: Dispatch<SetStateAction<NewProduct[]>>
}

export function useArray({ newProducts, setNewProducts }: Props) {
	const addProduct = () => {
		setNewProducts([
			...newProducts,
			{
				key: uuidV4(),
				group: null,
				id: '',
				linkId: '',
				name: '',
				count: 0
			}
		])
	}

	const handleProductChange = <K extends keyof NewProduct>(
		index: number,
		field: K,
		value: NewProduct[K]
	) => {
		const updatedSend = [...newProducts]
		updatedSend[index][field] = value
		setNewProducts(updatedSend)
	}

	const handleDeleteProduct = (key: string) => {
		setNewProducts(newProducts.filter(i => i.key !== key))
	}

	return { addProduct, handleProductChange, handleDeleteProduct }
}
