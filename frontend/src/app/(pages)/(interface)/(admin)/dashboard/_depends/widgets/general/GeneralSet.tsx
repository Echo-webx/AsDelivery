'use client'

import { Pencil } from 'lucide-react'
import { useState } from 'react'

import { Loader } from '@/components/loader/Loader'

import { ModalGeneralUpdate } from '../../features/general/modal/ModalUpdate'

import styles from './GeneralSet.module.scss'
import { useGeneral } from './hooks/useGeneral'

export function GeneralSetDashboard() {
	const [activeModal, setActiveModal] = useState(false)

	const { data, isLoading, isSuccess } = useGeneral()

	return (
		<div className={styles.main}>
			<div className={styles.form}>
				<button
					onClick={() => setActiveModal(true)}
					disabled={!data}
					className={`${styles.btn_edit} ${!data && styles.not_active}`}
				>
					<Pencil />
					<p>Изменить настройки</p>
				</button>
				<div className={styles.box_info}>
					<h1>Основные настройки</h1>
					<div className={styles.list}>
						{isLoading ? (
							<Loader
								isLoading={isLoading}
								type='dotted'
								box
								notShadow
							/>
						) : isSuccess && data ? (
							<>
								<div className={styles.info}>
									<div className={styles.text}>
										<span>Активность карты</span>
										<p>{data.activeMap === true ? 'Активна' : 'Не активна'}</p>
									</div>
									<div className={styles.text}>
										<span>Начало рабочего дня</span>
										<p>{data.startWorking}</p>
									</div>
									<div className={styles.text}>
										<span>Конец рабочего дня</span>
										<p>{data.endWorking}</p>
									</div>
								</div>

								<div className={styles.warning}>
									<p>
										Деактивация карты приведет к отключению карты на всем сайте.
										При создании регионов или адресов значения будут пропущены.
									</p>
								</div>
							</>
						) : (
							<div className={styles.not_success}>Ошибка загрузки</div>
						)}
					</div>
				</div>
			</div>
			<ModalGeneralUpdate
				isOpen={activeModal}
				onClose={() => setActiveModal(false)}
				data={data}
			/>
		</div>
	)
}
