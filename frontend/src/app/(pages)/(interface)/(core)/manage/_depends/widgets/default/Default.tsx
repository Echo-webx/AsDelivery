'use client'

import { MapPinHouse } from 'lucide-react'
import { useEffect, useState } from 'react'

import { MapMini } from '@/components/maps/MapMini'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import type { IAddress } from '@/types/address.types'

import { useGeneralSettingsStore } from '@/store/useGeneralStore'

import { FormCreate } from '../../features/default/FormCreate'
import { useAddress } from '../../features/default/hooks/useAddress'

import styles from './Default.module.scss'

export function ManageDefault() {
	const [selectAddress, setSelectAddress] = useState<(string | number)[]>([])
	const [address, setAddress] = useState<IAddress | null>(null)

	const [limit, setLimit] = useState(30)
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')

	const { data: dataGeneral } = useGeneralSettingsStore()

	const { data, isFetching, totalCount } = useAddress(page, limit, search)

	const findAddress = data?.filter(
		address => address.id === selectAddress[0]
	)[0]

	useEffect(() => {
		if (findAddress) {
			setAddress(findAddress)
		}
	}, [findAddress])

	return (
		<div className={styles.main}>
			<Select
				name='address'
				placeholder='* Выберите адрес'
				setValueData={setSelectAddress}
				lodash
				pagination
				totalCount={totalCount}
				page={page}
				limit={limit}
				setPage={setPage}
				isFetching={isFetching}
				onSearchChange={setSearch}
				defaultValue={address?.id}
				s_scrollHight={9}
				extra={styles.rSelect}
			>
				{data?.map(address => (
					<Option
						key={`${address.id}-manage`}
						value={address.id}
						content={`${address.name}`}
						svg={<MapPinHouse size={20} />}
					/>
				))}
			</Select>

			<div className={styles.manage}>
				{address ? (
					<>
						{dataGeneral?.activeMap === 'true' ? (
							address?.position ? (
								<div className={styles.form_map}>
									<h1>Расположения адреса</h1>
									<div className={styles.body}>
										<MapMini
											onlyPosition
											position={address?.position}
										/>
									</div>
								</div>
							) : (
								<div className={styles.no_activeMap}>
									<p>Расположения адреса пропущена. </p>
								</div>
							)
						) : (
							<div className={styles.no_activeMap}>
								<p>Карта деактивирована. </p>
							</div>
						)}
						<FormCreate address={address} />
					</>
				) : (
					<div className={styles.not_select}>
						<p>Для начало выберите адрес</p>
					</div>
				)}
			</div>
		</div>
	)
}
