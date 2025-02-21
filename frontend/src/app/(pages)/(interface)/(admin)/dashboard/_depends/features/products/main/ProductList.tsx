'use client'

import { Boxes, Package } from 'lucide-react'
import { type Dispatch, type SetStateAction, useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import type { IProduct } from '@/types/product.types'

import { formatDayJs } from '@/utils/dateHelpers'

import type {
	GroupProductSerDashboard,
	ModalProductDashboard
} from '../../../widgets/products/ProductsSet'

import styles from './ProductList.module.scss'
import { useProducts } from './hooks/useProduct'
import { ModalProductCreate } from './modal/ModalCreate'
import { ModalProduct } from './modal/ModalProduct'
import { ModalProductUpdate } from './modal/ModalUpdate'

interface Props {
	setActiveGroup: Dispatch<SetStateAction<GroupProductSerDashboard>>
	activeModal: ModalProductDashboard
	setActiveModal: Dispatch<SetStateAction<ModalProductDashboard>>
}

export function ProductListDashboard({
	setActiveGroup,
	activeModal,
	setActiveModal
}: Props) {
	const [selectProduct, setSelectProduct] = useState<IProduct | null>(null)
	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isLoading, isSuccess, isFetching, totalCount } = useProducts(
		page,
		limit,
		search
	)

	const { totalPages, handleSearchChange } = usePaginationAndSearch({
		page,
		setPage,
		setSearch,
		totalCount,
		limit,
		isFetching
	})

	const handleProductOpen = (product: IProduct) => {
		setSelectProduct(product)
		setActiveModal('product')
	}

	return (
		<>
			<div className={styles.box_products}>
				<div className={styles.top}>
					<h1>Продукты</h1>
					<button onClick={() => setActiveGroup('category')}>
						<Boxes size={22} />
						Категории
					</button>
				</div>
				<input
					onChange={handleSearchChange}
					placeholder='Поиск...'
					className={styles.search}
				></input>
				<div className={styles.list}>
					{isLoading || isFetching ? (
						<Loader
							isLoading={isLoading || isFetching}
							type='dotted'
							box
							notShadow
						/>
					) : isSuccess ? (
						data && data.length > 0 ? (
							data.map(product => (
								<div
									key={product.id}
									onClick={() => handleProductOpen(product)}
									className={styles.product}
								>
									<div className={styles.body}>
										<Package />
										<p>{product.name}</p>
									</div>

									<div className={styles.micro}>
										<p>Привязан к: {product?.linkCategories?.length || 0}</p>
										<span>
											{formatDayJs('D_MMMM_YYYY', product?.createdAt)}
										</span>
									</div>
								</div>
							))
						) : (
							<div className={styles.not_found}>Продуктов не найдено</div>
						)
					) : (
						<div className={styles.not_success}>Ошибка загрузки</div>
					)}
				</div>
			</div>
			<div className={styles.pagination}>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
					isFetching={isFetching}
				/>
			</div>
			{activeModal === 'product' && (
				<ModalProduct
					isOpen={activeModal === 'product'}
					onClose={() => setActiveModal(null)}
					product={selectProduct}
					setProduct={setSelectProduct}
					onEdit={() => setActiveModal('productUpdate')}
				/>
			)}
			{activeModal === 'productCreate' && (
				<ModalProductCreate
					isOpen={activeModal === 'productCreate'}
					onClose={() => setActiveModal(null)}
				/>
			)}
			{activeModal === 'productUpdate' && (
				<ModalProductUpdate
					isOpen={activeModal === 'productUpdate'}
					onClose={() => setActiveModal(null)}
					product={selectProduct}
					setProduct={setSelectProduct}
				/>
			)}
		</>
	)
}
