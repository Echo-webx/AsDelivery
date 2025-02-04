'use client'

import { useState } from 'react'

import type { IUser } from '@/types/user.types'

import { DefaultSet } from '../../features/root/UserDefaultSet'
import { ManagerSet } from '../../features/root/UserManagerSet'

import styles from './Root.module.scss'

export type ManageGroup = 'manager' | 'default'

export function ManageRoot() {
	const [activeGroup, setActiveGroup] = useState<ManageGroup>('default')
	const [user, setUser] = useState<IUser | null>(null)
	const [manager, setManager] = useState<IUser | null>(null)

	return (
		<div className={styles.main}>
			<div className={styles.buttons}>
				<button
					onClick={() => setActiveGroup('manager')}
					className={activeGroup === 'manager' ? styles.active : ''}
				>
					Менеджеры
				</button>
				<button
					onClick={() => setActiveGroup('default')}
					className={activeGroup === 'default' ? styles.active : ''}
				>
					Обычные
				</button>
			</div>
			{activeGroup === 'manager' && (
				<ManagerSet
					user={manager}
					setUser={setManager}
				/>
			)}
			{activeGroup === 'default' && (
				<DefaultSet
					user={user}
					setUser={setUser}
				/>
			)}
		</div>
	)
}
