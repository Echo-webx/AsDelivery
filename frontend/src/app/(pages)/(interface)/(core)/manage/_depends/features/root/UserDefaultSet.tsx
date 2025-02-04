'use client'

import { CircleUser } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import { Select } from '@/components/ui/select/Select'
import { OptionSpan } from '@/components/ui/select/element/OptionSpan'

import type { IUser } from '@/types/user.types'

import { formatDayJs } from '@/utils/dateHelpers'
import { formatNumber } from '@/utils/formatters'

import { useUsersDefault } from '../../../../_depends/useUsersDefault'
import { ManageProducts } from '../products/Products'

import { ManageRegions } from './Regions'
import styles from './UserSet.module.scss'

export type GroupDefault = 'product' | 'region' | null
export type ManageModal = 'addRegion' | 'editRegion' | 'deleteRegion' | null

interface Props {
	user: IUser | null
	setUser: Dispatch<SetStateAction<IUser | null>>
}

export function DefaultSet({ user, setUser }: Props) {
	const [activeGroup, setActiveGroup] = useState<GroupDefault>('product')
	const [activeModal, setActiveModal] = useState<ManageModal>(null)
	const [selectUser, setSelectUser] = useState<(string | number)[]>([])

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
					<OptionSpan
						key={`${user.id}-manage-root-default`}
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
								{user?.wages && <span>{formatNumber(user.wages)} тг</span>}
							</div>

							<div className={styles.micro}>
								<p>{user.email}</p>
								<span>{formatDayJs('D_MMMM_YYYY', user.createdAt)}</span>
							</div>
						</div>
						{activeGroup === 'product' && (
							<ManageProducts
								setActiveGroup={setActiveGroup}
								user={user}
							/>
						)}
						{activeGroup === 'region' && (
							<ManageRegions
								setActiveGroup={setActiveGroup}
								activeModal={activeModal}
								setActiveModal={setActiveModal}
								user={user}
							/>
						)}
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
