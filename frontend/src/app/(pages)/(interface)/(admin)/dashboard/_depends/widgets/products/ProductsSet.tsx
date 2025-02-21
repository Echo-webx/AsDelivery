'use client'

import { Blocks, PackagePlus } from 'lucide-react'
import { useState } from 'react'

import { ProductCategoryListDashboard } from '../../features/products/category/CategoryList'
import { ProductListDashboard } from '../../features/products/main/ProductList'

import styles from './ProductsSet.module.scss'

export type GroupProductSerDashboard = 'product' | 'category' | null

export type ModalProductDashboard =
	| 'product'
	| 'productCreate'
	| 'productUpdate'
	| 'category'
	| 'categoryCreate'
	| 'categoryUpdate'
	| null

export function ProductsSetDashboard() {
	const [activeGroup, setActiveGroup] =
		useState<GroupProductSerDashboard>('product')
	const [activeModal, setActiveModal] = useState<ModalProductDashboard>(null)

	return (
		<div className={styles.main}>
			<div className={styles.form}>
				{activeGroup === 'product' && (
					<>
						<button
							onClick={() => setActiveModal('productCreate')}
							className={styles.btn_add}
						>
							<PackagePlus />
							<p>Добавить продукт</p>
						</button>
						<ProductListDashboard
							setActiveGroup={setActiveGroup}
							activeModal={activeModal}
							setActiveModal={setActiveModal}
						/>
					</>
				)}
				{activeGroup === 'category' && (
					<>
						<button
							onClick={() => setActiveModal('categoryCreate')}
							className={styles.btn_add}
						>
							<Blocks />
							<p>Добавить категорию</p>
						</button>
						<ProductCategoryListDashboard
							setActiveGroup={setActiveGroup}
							activeModal={activeModal}
							setActiveModal={setActiveModal}
						/>
					</>
				)}
			</div>
		</div>
	)
}
