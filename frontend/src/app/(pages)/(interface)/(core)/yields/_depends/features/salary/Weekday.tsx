import { CircleDollarSign, Trash2, UserCircle } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

import { Loader } from '@/components/loader/Loader'
import { DefaultField } from '@/components/ui/fields/DefaultField'
import { Select } from '@/components/ui/select/Select'
import { Option } from '@/components/ui/select/element/Option'

import { EnumSalaryWeekday } from '@/types/salary.types'

import useToast from '@/hooks/useToast'

import styles from '../../widgets/salary/Salary.module.scss'

import { useArray } from './hooks/useArray'
import { useSalary } from './hooks/useSalary'
import { useSalarySend } from './hooks/useSalarySend'
import { useSalaryUsers } from './hooks/useSalaryUsers'
import { useValidError } from './hooks/useValidError'

interface Props {
	week: string
	weekday: EnumSalaryWeekday
	salaries: NewSalary[]
	setSalaries: Dispatch<SetStateAction<NewSalary[]>>
}

export interface NewSalary {
	key: string
	id: string
	linkId: string
	weekday: EnumSalaryWeekday
	name: string
	wages: number
}

export function Weekday({ week, weekday, salaries, setSalaries }: Props) {
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(30)
	const [search, setSearch] = useState('')
	const [searchValue, setSearchValue] = useState('')

	const {
		data: dataUsers,
		totalCount,
		isFetching: isFetchingUsers
	} = useSalaryUsers(week, page, limit, search)

	const { addSalary, handleSalaryChange, handleDeleteSalary } = useArray({
		weekday,
		salaries,
		setSalaries
	})

	const { getFieldError, validateForm, checkDuplicateClass, hasDuplicateIds } =
		useValidError({ salaries, styles })

	const { toast } = useToast()

	const { data, isLoading, isSuccess, isFetching } = useSalary(week)

	useEffect(() => {
		if (isSuccess && !isFetching && data) {
			setSalaries(
				data.map(item => ({
					key: uuidV4(),
					id: item.user.id,
					linkId: item.id,
					weekday: item.weekday,
					name: `${item.user.info?.name} ${item.user.info?.surname} ${item.user.info?.patronymic}`,
					wages: item.wages
				}))
			)
		}
	}, [isSuccess, isFetching])

	const { mutate, isPending } = useSalarySend()

	const handleMutate = () => {
		if (!validateForm()) return toast.error('Данные не верны')
		if (hasDuplicateIds()) return toast.error('Дубликат данных!')

		mutate({ week, items: salaries })
	}

	return (
		<>
			<div className={styles.table}>
				<h1>Заработная плата сотрудников</h1>
				<div className={styles.relative}>
					<Loader
						isLoading={(!isLoading && isFetching) || isPending}
						type='dotted'
						box
						notShadow
					/>
					<div className={styles.list}>
						{isLoading ? (
							<Loader
								isLoading={isLoading}
								type='dotted'
								box
								notShadow
							/>
						) : isSuccess ? (
							salaries.filter(i => i.weekday === weekday).length > 0 ? (
								salaries
									.filter(i => i.weekday === weekday)
									.map((item, index) => (
										<div
											key={item.key}
											className={`${styles.item_edit} ${checkDuplicateClass(item.id, weekday)}`}
										>
											<div
												className={`${styles.body} ${getFieldError(weekday, index, 'id')}`}
											>
												<UserCircle />
												<Select
													name='id'
													placeholder='* Выберите пользователя'
													lodash
													pagination
													totalCount={totalCount}
													page={page}
													setPage={setPage}
													limit={limit}
													searchValue={searchValue}
													setSearchValue={setSearchValue}
													isFetching={isFetchingUsers}
													onSearchChange={setSearch}
													defaultData={[
														{
															value: item.id,
															content: item.name,
															additionalData: {
																linkId: item.linkId
															}
														}
													]}
													setData={values => {
														handleSalaryChange(
															item.key,
															'id',
															`${values[0].value}`
														)
														handleSalaryChange(
															item.key,
															'name',
															`${values[0].content}`
														)
														handleSalaryChange(
															item.key,
															'linkId',
															values[0].additionalData?.linkId
														)
													}}
													extra={styles.rSelect}
													s_scrollHight={5}
												>
													{dataUsers?.map(user => (
														<Option
															key={user.id}
															value={user.id}
															content={`${user.info?.name} ${user.info?.surname} ${user.info?.patronymic}`}
															additionalData={{
																linkId: user.salary?.find(
																	s => s.weekday === weekday
																)?.id
															}}
															svg={<UserCircle size={20} />}
														/>
													))}
												</Select>
												<Trash2
													onClick={() => handleDeleteSalary(item.key)}
													className={styles.del}
												/>
											</div>
											<div
												className={`${styles.micro} ${getFieldError(weekday, index, 'wages')}`}
											>
												<CircleDollarSign />
												<DefaultField
													id={`wages${index}`}
													name={`wages${index}`}
													placeholder='* Количество'
													defaultValue={item.wages || ''}
													isNumber
													extra={styles.rField}
													onChange={e =>
														handleSalaryChange(
															item.key,
															'wages',
															+e.target.value
														)
													}
												/>
											</div>
										</div>
									))
							) : (
								<div className={styles.not_found}>
									Добавьте позицию для начало
								</div>
							)
						) : (
							<div className={styles.not_success}>Ошибка загрузки</div>
						)}
					</div>
				</div>
			</div>
			<div className={styles.buttons}>
				<button
					type='button'
					onClick={addSalary}
					disabled={isPending || isFetching}
				>
					Добавить
				</button>
				<button
					type='submit'
					onClick={() => handleMutate()}
					disabled={isPending || isFetching}
					className={styles.send}
				>
					Изменить
				</button>
			</div>
		</>
	)
}
