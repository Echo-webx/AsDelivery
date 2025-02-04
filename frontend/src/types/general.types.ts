import type { IRoot } from './root.types'

export interface IGeneral extends IRoot {
	startWorking: number
	endWorking: number
	activeMap: boolean
}

export interface IGeneralSettings {
	startWorking: number
	endWorking: number
	activeMap: boolean
}

export type TypeGeneral = Omit<IGeneral, 'activeMap'> & {
	activeMap: string
}
