import { load } from '@2gis/mapgl'
import { Map } from '@2gis/mapgl/types'
import { memo, useEffect, useRef } from 'react'
import type { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form'

import styles from './MapMini.module.scss'

interface Props {
	setValue?: UseFormSetValue<any>
	register?: UseFormRegisterReturn
	position?: string
	onlyPosition?: boolean
}

export function MapMini({ setValue, register, position, onlyPosition }: Props) {
	const markerRef = useRef<any>(null)

	useEffect(() => {
		let map: Map | undefined

		const initialPosition = position
			? (position.split(',').map(coord => parseFloat(coord)) as [
					number,
					number
				])
			: [71.425, 51.138]

		load().then(mapGlAPI => {
			map = new mapGlAPI.Map('map-container', {
				center: initialPosition,
				zoom: 12,
				key: process.env.NEXT_PUBLIC_2GIS_KEY
			})

			if (position && !markerRef.current) {
				markerRef.current = new mapGlAPI.Marker(map, {
					coordinates: initialPosition,
					icon: '/marker/blue.svg',
					size: [30, 30],
					anchor: [15, 30]
				})

				if (setValue) {
					setValue('position', position, { shouldValidate: true })
				}
			}

			if (!onlyPosition) {
				map.on('click', e => {
					const { lngLat } = e

					if (setValue) {
						setValue('position', `${lngLat}`, { shouldValidate: true })
					}

					if (markerRef.current) {
						markerRef.current.setCoordinates(lngLat)
					} else if (map) {
						markerRef.current = new mapGlAPI.Marker(map, {
							coordinates: lngLat,
							icon: '/marker/blue.svg',
							size: [27, 27],
							anchor: [13.5, 27]
						})
					}
				})
			}
		})

		return () => map && map.destroy()
	}, [])

	return (
		<>
			<MapWrapper />
			<input
				type='hidden'
				{...register}
			/>
		</>
	)
}

const MapWrapper = memo(
	() => {
		return (
			<div
				id='map-container'
				className={styles.map}
			></div>
		)
	},
	() => true
)
