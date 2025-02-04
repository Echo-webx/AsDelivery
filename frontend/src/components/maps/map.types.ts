import {
	Circle,
	CircleMarker,
	Control,
	DefaultSource,
	FloorControl,
	GeoJsonSource,
	GltfModel,
	HtmlMarker,
	Label,
	Map,
	Marker,
	Polygon,
	Polyline,
	Raster,
	RasterTileSource,
	ScaleControl,
	TrafficControl,
	ZoomControl
} from '@2gis/mapgl/types'

export interface MapGL {
	Map: typeof Map
	Marker: typeof Marker
	Label: typeof Label
	HtmlMarker: typeof HtmlMarker
	Circle: typeof Circle
	CircleMarker: typeof CircleMarker
	Polyline: typeof Polyline
	Polygon: typeof Polygon
	Raster: typeof Raster
	GltfModel: typeof GltfModel
	Control: typeof Control
	ZoomControl: typeof ZoomControl
	TrafficControl: typeof TrafficControl
	FloorControl: typeof FloorControl
	ScaleControl: typeof ScaleControl
	GeoJsonSource: typeof GeoJsonSource
	RasterTileSource: typeof RasterTileSource
	DefaultSource: typeof DefaultSource
}
