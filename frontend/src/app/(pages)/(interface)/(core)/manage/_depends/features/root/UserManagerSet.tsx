'use client'

import { CircleUser } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import type { IUser } from '@/types/user.types'

import { formatDayJs } from '@/utils/dateHelpers'

import { ManageRegions } from './Regions'
import type { ManageModal } from './UserDefaultSet'
import styles from './UserSet.module.scss'
import { useUsersManager } from './hooks/useUsersManager'

interface Props {
	user: IUser | null
	setUser: Dispatch<SetStateAction<IUser | null>>
}

export function ManagerSet({ user, setUser }: Props) {
	const [activeModal, setActiveModal] = useState<ManageModal>(null)
	const [selectUser, setSelectUser] = useState<(string | number)[]>([])

	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isFetching, totalCount } = useUsersManager(page, limit, search)

	const findUser = data?.filter(user => user.id === selectUser[0])[0]

	useEffect(() => {
		if (findUser) {
			setUser(findUser)
		}
	}, [findUser])

	return (
		<>
			<Select
				name='userId'
				placeholder='* Выберите пользователя'
				setValueData={setSelectUser}
				lodash
				pagination
				totalCount={totalCount}
				page={page}
				limit={limit}
				setPage={setPage}
				isFetching={isFetching}
				onSearchChange={setSearch}
				defaultValue={user?.id}
				s_scrollHight={9}
				extra={styles.rSelect}
			>
				{data?.map(user => (
					<Option
						key={`${user.id}-manage-root-manager`}
						value={user.id}
						content={`${user.info?.name} ${user.info?.surname} ${user.info?.patronymic}`}
						svg={<CircleUser size={20} />}
					/>
				))}
			</Select>

			<div className={styles.manage}>
				{user ? (
					<>
						<div className={styles.info}>
							<div className={styles.body}>
								<p>{user?.info?.jobPosition}</p>
							</div>

							<div className={styles.micro}>
								<p>{user.email}</p>
								<span>{formatDayJs('D_MMMM_YYYY', user.createdAt)}</span>
							</div>
						</div>
						<ManageRegions
							activeModal={activeModal}
							setActiveModal={setActiveModal}
							user={user}
						/>
					</>
				) : (
					<div className={styles.not_select}>
						<p>Для начало выберите пользователя</p>
					</div>
				)}
			</div>
		</>
	)
}
