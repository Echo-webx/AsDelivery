import type { IProductReception } from './reception.types'
import type { IProductRelease } from './release.types'

export type ISearch = Partial<IProductRelease> & Partial<IProductReception>
