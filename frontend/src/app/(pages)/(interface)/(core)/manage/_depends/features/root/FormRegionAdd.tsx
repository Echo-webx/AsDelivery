import { Grid2x2Plus, MapPinned } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/Loader'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import type { IUser } from '@/types/user.types'

import styles from './Regions.module.scss'
import { useRegionAdd } from './hooks/useRegionAdd'
import { useRegionsForUser } from './hooks/useRegions'

interface ModalProps {
	user: IUser
}

type TypeAddRegion = {
	regionId: string
}

export function FormRegionAdd({ user }: ModalProps) {
	const [limit, setLimit] = useState(20)
	const [pageRegion, setPageRegion] = useState(1)
	const [searchRegion, setSearchRegion] = useState('')

	const {
		data: dataRegion,
		isFetching: isFetchingRegion,
		totalCount: totalCountRegion
	} = useRegionsForUser(pageRegion, limit, searchRegion)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<TypeAddRegion>({
		mode: 'onChange'
	})

	const { mutate, isPending } = useRegionAdd({
		reset
	})

	const onSubmit: SubmitHandler<TypeAddRegion> = data => {
		mutate({ ...data, id: user.id })
	}

	return (
		<form
			className={styles.form_add}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Select
				name='regionId'
				placeholder='* Выберите регион'
				setValue={setValue}
				lodash
				pagination
				totalCount={totalCountRegion}
				page={pageRegion}
				limit={limit}
				setPage={setPageRegion}
				isFetching={isFetchingRegion}
				onSearchChange={setSearchRegion}
				error={errors.regionId?.message}
				s_scrollHight={5}
				extra={styles.rSelect}
				register={register('regionId', { required: 'Требуется регион' })}
			>
				{dataRegion?.map(product => (
					<Option
						key={product.id}
						value={product.id}
						content={product.name}
						svg={<MapPinned size={20} />}
					/>
				))}
			</Select>

			<button
				type='submit'
				disabled={isPending}
				className={styles.btn_add}
			>
				<Loader
					isLoading={isPending}
					type='dotted'
					box
					notShadow
				/>
				<Grid2x2Plus />
				<p>Добавить</p>
			</button>
		</form>
	)
}
