'use client'

import { Boxes, Package } from 'lucide-react'
import { type Dispatch, type SetStateAction, useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import type { IProductCategory } from '@/types/product-category.types'

import { formatDayJs } from '@/utils/dateHelpers'

import type {
	GroupProductSerDashboard,
	ModalProductDashboard
} from '../../../widgets/products/ProductsSet'

import styles from './CategoryList.module.scss'
import { useCategory } from './hooks/useCategory'
import { ModalCategory } from './modal/ModalCategory'
import { ModalCategoryCreate } from './modal/ModalCreate'
import { ModalCategoryUpdate } from './modal/ModalUpdate'

interface Props {
	setActiveGroup: Dispatch<SetStateAction<GroupProductSerDashboard>>
	activeModal: ModalProductDashboard
	setActiveModal: Dispatch<SetStateAction<ModalProductDashboard>>
}

export function ProductCategoryListDashboard({
	setActiveGroup,
	activeModal,
	setActiveModal
}: Props) {
	const [selectProductCategory, setSelectProductCategory] =
		useState<IProductCategory | null>(null)
	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isLoading, isSuccess, isFetching, totalCount } = useCategory(
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

	const handleCategoryOpen = (category: IProductCategory) => {
		setSelectProductCategory(category)
		setActiveModal('category')
	}

	return (
		<>
			<div className={styles.box_product_categories}>
				<div className={styles.top}>
					<h1>Категории</h1>
					<button onClick={() => setActiveGroup('product')}>
						<Package size={22} />
						Продукты
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
							data.map(category => (
								<div
									key={category.id}
									onClick={() => handleCategoryOpen(category)}
									className={styles.category}
								>
									<div className={styles.body}>
										<Boxes />
										<p>{category.name}</p>
									</div>

									<div className={styles.micro}>
										<p>
											Всего продуктов: {category?.linkProducts?.length || 0}
										</p>
										<span>
											{formatDayJs('D_MMMM_YYYY', category?.createdAt)}
										</span>
									</div>
								</div>
							))
						) : (
							<div className={styles.not_found}>Категорий не найдено</div>
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
			{activeModal === 'category' && (
				<ModalCategory
					isOpen={activeModal === 'category'}
					onClose={() => setActiveModal(null)}
					productCategory={selectProductCategory}
					setProductCategory={setSelectProductCategory}
					onEdit={() => setActiveModal('categoryUpdate')}
				/>
			)}
			{activeModal === 'categoryCreate' && (
				<ModalCategoryCreate
					isOpen={activeModal === 'categoryCreate'}
					onClose={() => setActiveModal(null)}
				/>
			)}
			{activeModal === 'categoryUpdate' && (
				<ModalCategoryUpdate
					isOpen={activeModal === 'categoryUpdate'}
					onClose={() => setActiveModal(null)}
					productCategory={selectProductCategory}
					setProductCategory={setSelectProductCategory}
				/>
			)}
		</>
	)
}
