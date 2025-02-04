import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common'
import { Auth } from '../../common/decorators/auth.decorator'
import { GeneralDto } from './dto/general.dto'
import { GeneralService } from './general.service'

@Controller('general')
export class GeneralController {
	constructor(private readonly generalService: GeneralService) {}

	@Get('settings')
	@Auth()
	async getGeneralSettings() {
		return this.generalService.getGeneralSettings()
	}

	@Get()
	@Auth('root')
	async getGeneral() {
		return this.generalService.getGeneral()
	}

	@HttpCode(200)
	@Put()
	@Auth('root')
	async editGeneral(@Body() dto: GeneralDto) {
		return this.generalService.editGeneral(dto)
	}
}
