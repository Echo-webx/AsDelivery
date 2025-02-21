import { load } from '@2gis/mapgl'
import { Map, Marker } from '@2gis/mapgl/types'
import { memo, useEffect, useRef, useState } from 'react'

import { EnumAddressStatus } from '@/types/address.types'

import styles from './MapMain.module.scss'
import type { MapGL } from './map.types'

interface PropsMarkerValue {
	position: number[]
	name: string
	status?: EnumAddressStatus
}

interface Props {
	dataMarker?: PropsMarkerValue[]
	isFetching?: boolean
	centerMap?: number[]
	onlyPosition?: boolean
}

export function MapMain({
	dataMarker,
	isFetching,
	centerMap,
	onlyPosition
}: Props) {
	const mapRef = useRef<Map | undefined>(undefined)
	const markerRef = useRef<Marker[]>([])
	const mapAPIRef = useRef<MapGL | null>(null)
	const [isMapLoaded, setIsMapLoaded] = useState(false)

	const [selectedMarker, setSelectedMarker] = useState<PropsMarkerValue | null>(
		null
	)

	// Инициализация
	useEffect(() => {
		const initializeMap = async () => {
			if (!mapAPIRef.current) mapAPIRef.current = await load()
			await new Promise(resolve => setTimeout(resolve, 100))

			const mapContainer = document.getElementById('map-container')
			if (!mapContainer) return

			if (mapAPIRef.current !== null && !mapRef.current && !isMapLoaded) {
				const initialPosition = centerMap || [71.425, 51.138]
				const newMap = new mapAPIRef.current.Map('map-container', {
					center: initialPosition,
					zoom: 12,
					key: process.env.NEXT_PUBLIC_2GIS_KEY
				})

				if (!onlyPosition)
					newMap.on('click', () => {
						setSelectedMarker(null)
					})

				mapRef.current = newMap
				setIsMapLoaded(true)
			}
		}
		initializeMap()

		return () => {
			if (mapRef.current) mapRef.current.destroy()
		}
	}, [])

	// Центрирование карты
	useEffect(() => {
		if (isMapLoaded && mapRef.current && centerMap) {
			mapRef.current.setCenter(centerMap)
		}
	}, [centerMap, isMapLoaded])

	// Метки
	useEffect(() => {
		const updateMarkers = async () => {
			if (isMapLoaded && mapAPIRef.current && mapRef.current && dataMarker) {
				markerRef.current.forEach(marker => marker.destroy())
				markerRef.current = []

				dataMarker.forEach(mar => {
					const marker = new mapAPIRef.current!.Marker(mapRef.current!, {
						coordinates: mar.position,
						icon:
							selectedMarker?.position === mar.position
								? 'images/marker/purple.svg'
								: mar.status === EnumAddressStatus.confirm
									? 'images/marker/green.svg'
									: mar.status === EnumAddressStatus.error
										? 'images/marker/red.svg'
										: 'images/marker/blue.svg',
						size: [30, 30],
						anchor: [15, 30],
						...(!onlyPosition &&
							selectedMarker?.position === mar.position && {
								label: {
									text: mar.name,
									offset: [0, 25],
									relativeAnchor: [0.5, 0],
									image: {
										url: 'images/marker/tooltip.svg',
										size: [100, 50],
										stretchX: [
											[10, 40],
											[60, 90]
										],
										stretchY: [[20, 40]],
										padding: [14, 7, 7, 7]
									}
								}
							})
					})
					markerRef.current.push(marker)

					if (!onlyPosition)
						marker.on('click', () => {
							setSelectedMarker(mar)
						})
				})
			}
		}
		if (isFetching === false) {
			updateMarkers()
		}
	}, [isMapLoaded, selectedMarker, onlyPosition, isFetching])

	return <MapWrapper />
}

const MapWrapper = memo(
	() => {
		return (
			<div
				id='map-container'
				className={styles.map}
			/>
		)
	},
	() => true
)
