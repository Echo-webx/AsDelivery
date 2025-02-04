import { BadRequestException, Injectable } from '@nestjs/common'
import { ExtConfigService } from 'src/core/services/config.service'
import {
	handlePrismaError,
	PrismaService
} from 'src/core/services/prisma.service'
import { GeneralDto } from './dto/general.dto'

@Injectable()
export class GeneralService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly extendConfig: ExtConfigService
	) {}

	async getGeneral() {
		return await this.prisma.general.findFirst()
	}

	async getGeneralSettings() {
		return this.extendConfig.getGeneral()
	}

	async editGeneral(dto: GeneralDto) {
		const general = await this.getGeneral()
		if (!general) throw new BadRequestException('General not found')

		try {
			const updatedGeneral = await this.prisma.general.update({
				where: { id: general.id },
				data: {
					startWorking: dto.startWorking,
					endWorking: dto.endWorking,
					activeMap: dto.activeMap
				}
			})

			this.extendConfig.setGeneral({
				startWorking: updatedGeneral.startWorking,
				endWorking: updatedGeneral.endWorking,
				activeMap: updatedGeneral.activeMap
			})

			return updatedGeneral
		} catch (err) {
			handlePrismaError(err, 'Error edit General', {
				notFound: 'General not found'
			})
		}
	}
}
