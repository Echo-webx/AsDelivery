import { IsBoolean, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class GeneralDto {
	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(24)
	startWorking: number

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Max(24)
	endWorking: number

	@IsNotEmpty()
	@IsBoolean()
	activeMap: boolean
}

export type TypeGeneral = {
	startWorking?: number
	endWorking?: number
	activeMap?: boolean
}
