'use client'

import { CircleUser } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Select } from '@/components/ui/select/Select'
import { OptionSpan } from '@/components/ui/select/element/OptionSpan'

import type { IUser } from '@/types/user.types'

import { formatDayJs } from '@/utils/dateHelpers'
import { formatNumber } from '@/utils/formatters'

import { useUsersDefault } from '../../../../_depends/useUsersDefault'
import { ManageProducts } from '../../features/products/Products'

import styles from './Manager.module.scss'

export function ManageManager() {
	const [selectUser, setSelectUser] = useState<(string | number)[]>([])
	const [user, setUser] = useState<IUser | null>(null)

	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data, isFetching, totalCount } = useUsersDefault(page, limit, search)

	const findUser = data?.filter(user => user.id === selectUser[0])[0]

	useEffect(() => {
		if (findUser) {
			setUser(findUser)
		}
	}, [findUser])

	return (
		<div className={styles.main}>
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
					<OptionSpan
						key={`${user.id}-manage-manager`}
						value={user.id}
						content={`${user.info?.name} ${user.info?.surname} ${user.info?.patronymic}`}
						svg={<CircleUser size={20} />}
						span={
							<span
								className={`${styles.rSpan} ${
									user.count > 0
										? styles.green
										: user.count < 0
											? styles.red
											: ''
								}`}
							>{`${user.count}`}</span>
						}
					/>
				))}
			</Select>

			<div className={styles.manage}>
				{user ? (
					<>
						<div className={styles.info}>
							<div className={styles.body}>
								<p>{user?.info?.jobPosition}</p>
								{user.wages && <span>{formatNumber(user.wages)}</span>}
							</div>

							<div className={styles.micro}>
								<p>{user.email}</p>
								<span>{formatDayJs('D_MMMM_YYYY', user.createdAt)}</span>
							</div>
						</div>
						<ManageProducts user={user} />
					</>
				) : (
					<div className={styles.not_select}>
						<p>Для начало выберите пользователя</p>
					</div>
				)}
			</div>
		</div>
	)
}
