'use client'

import { EnumUserRole } from '@/types/user.types'

import { useProfileStore } from '@/store/useProfileStore'

import { ManageDefault } from './widgets/default/Default'
import { ManageManager } from './widgets/manager/Manager'
import { ManageRoot } from './widgets/root/Root'

export type ManageButtons = 'manager' | 'default'

export function Manage() {
	const { data } = useProfileStore()

	return (
		<>
			{data?.role === EnumUserRole.root && <ManageRoot />}
			{data?.role === EnumUserRole.manager && <ManageManager />}
			{data?.role === EnumUserRole.default && <ManageDefault />}
		</>
	)
}
