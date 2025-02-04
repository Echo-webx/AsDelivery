'use client'

import { UserPen, UserPlus } from 'lucide-react'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'
import { Pagination } from '@/components/ui/pagination/Pagination'
import { usePaginationAndSearch } from '@/components/ui/pagination/usePaginationAndSearch'

import type { IUser } from '@/types/user.types'

import { formatDayJs } from '@/utils/dateHelpers'

import { ModalUserCreate } from '../../features/users/modal/ModalCreate'
import { ModalUserUpdate } from '../../features/users/modal/ModalUpdate'
import { ModalUser } from '../../features/users/modal/ModalUser'

import styles from './UsersSet.module.scss'
import { useUsers } from './hooks/useUsers'

export type ModalUsersDashboard = 'user' | 'userCreate' | 'userUpdate' | null

export function UsersSetDashboard() {
	const [activeModal, setActiveModal] = useState<ModalUsersDashboard>(null)
	const [selectUser, setSelectUser] = useState<IUser | null>(null)

	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isLoading, isSuccess, isFetching, totalCount } = useUsers(
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

	const handleUserOpen = (user: IUser) => {
		setSelectUser(user)
		setActiveModal('user')
	}

	return (
		<div className={styles.main}>
			<div className={styles.form}>
				<button
					onClick={() => setActiveModal('userCreate')}
					className={styles.btn_add}
				>
					<UserPlus />
					<p>Добавить пользователя</p>
				</button>
				<div className={styles.box_users}>
					<h1>Пользователи</h1>
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
								data.map(user => (
									<div
										key={user.id}
										onClick={() => handleUserOpen(user)}
										className={styles.profile}
									>
										<div className={styles.body}>
											<UserPen />
											<p>
												{`${user.info?.name} ${user.info?.surname} ${user.info?.patronymic}`}
											</p>
										</div>

										<div className={styles.micro}>
											<p>{user.email}</p>
											<span>{formatDayJs('D_MMMM_YYYY', user?.createdAt)}</span>
										</div>
									</div>
								))
							) : (
								<div className={styles.not_found}>Пользователей не найдено</div>
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
			</div>
			{activeModal === 'user' && (
				<ModalUser
					isOpen={activeModal === 'user'}
					onClose={() => setActiveModal(null)}
					user={selectUser}
					setUser={setSelectUser}
					onEdit={() => setActiveModal('userUpdate')}
				/>
			)}
			{activeModal === 'userCreate' && (
				<ModalUserCreate
					isOpen={activeModal === 'userCreate'}
					onClose={() => setActiveModal(null)}
				/>
			)}
			{activeModal === 'userUpdate' && (
				<ModalUserUpdate
					isOpen={activeModal === 'userUpdate'}
					onClose={() => setActiveModal(null)}
					user={selectUser}
					setUser={setSelectUser}
				/>
			)}
		</div>
	)
}
