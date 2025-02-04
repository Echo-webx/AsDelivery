'use client'

import {
	LandPlot,
	MapPinHouse,
	Settings,
	ShoppingBasket,
	UserCog
} from 'lucide-react'
import { useState } from 'react'

import styles from './Dashboard.module.scss'
import { ButtonListDashboard } from './features/ButtonList'
import { AddressSetDashboard } from './widgets/address/AddressSet'
import { GeneralSetDashboard } from './widgets/general/GeneralSet'
import { ProductsSetDashboard } from './widgets/products/ProductsSet'
import { RegionsSetDashboard } from './widgets/regions/RegionsSet'
import { UsersSetDashboard } from './widgets/users/UsersSet'

export type ButtonDashboard =
	| 'general'
	| 'users'
	| 'regions'
	| 'address'
	| 'products'
	| null

export function Dashboard() {
	const [activeButton, setActiveButton] = useState<ButtonDashboard>(null)

	return (
		<div className={styles.main}>
			{!activeButton ? (
				<div className={styles.form}>
					<button
						onClick={() => setActiveButton('general')}
						className={styles.link}
					>
						<Settings />
						<p>Общая настройка</p>
					</button>
					<button
						onClick={() => setActiveButton('users')}
						className={styles.link}
					>
						<UserCog />
						<p>Настройка пользователей</p>
					</button>
					<button
						onClick={() => setActiveButton('regions')}
						className={styles.link}
					>
						<LandPlot />
						<p>Настройка регионов</p>
					</button>
					<button
						onClick={() => setActiveButton('address')}
						className={styles.link}
					>
						<MapPinHouse />
						<p>Настройка адресов</p>
					</button>
					<button
						onClick={() => setActiveButton('products')}
						className={styles.link}
					>
						<ShoppingBasket />
						<p>Настройка продуктов</p>
					</button>
				</div>
			) : (
				<ButtonListDashboard
					activeButton={activeButton}
					setActiveButton={setActiveButton}
				/>
			)}
			{activeButton === 'general' && <GeneralSetDashboard />}
			{activeButton === 'users' && <UsersSetDashboard />}
			{activeButton === 'regions' && <RegionsSetDashboard />}
			{activeButton === 'address' && <AddressSetDashboard />}
			{activeButton === 'products' && <ProductsSetDashboard />}
		</div>
	)
}
