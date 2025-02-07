import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnumUserRole } from '@prisma/client'
import { hash } from 'argon2'
import { TypeGeneral } from '../../modules/general/dto/general.dto'
import { PrismaService } from './prisma.service'

@Injectable()
export class ExtConfigService extends ConfigService implements OnModuleInit {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {
		super()
	}

	async onModuleInit() {
		Logger.log('[ExtendConfig] Initialized...')
		await this.initialGeneral()
	}

	private async findGeneral() {
		try {
			const general = await this.prisma.general.findFirst()
			if (!general)
				return await this.prisma.general.create({
					data: {
						startWorking: 9,
						endWorking: 18,
						activeMap: true
					}
				})
			return general
		} catch (err) {
			throw new Error(`ExtConfigService, findGeneralConfig: ${err.message}`)
		}
	}

	private async findRootUser() {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					email: this.getOrThrow<string>('DEFAULT_ROOT_EMAIL')
				},
				select: { id: true }
			})
			if (user) return

			const email = this.getOrThrow<string>('DEFAULT_ROOT_EMAIL')
			const password = this.getOrThrow<string>('DEFAULT_ROOT_PASSWORD')
			if (!email || !password) return

			await this.prisma.user.create({
				data: {
					email,
					password: await hash(password),
					role: EnumUserRole.root,
					checkRegion: false,
					info: {
						create: {
							jobPosition: 'Тех. Администратор',
							name: 'Тех. Администратор',
							surname: 'A',
							patronymic: 'A'
						}
					}
				}
			})
		} catch (err) {
			throw new Error(`ExtConfigService, findRootUser: ${err.message}`)
		}
	}

	async initialGeneral() {
		await this.findRootUser()
		const general = await this.findGeneral()
		this.setGeneral({
			startWorking: general.startWorking,
			endWorking: general.endWorking,
			activeMap: general.activeMap
		})
	}

	getGeneral() {
		const startWorking = this.getOrThrow<number>('START_WORKING')
		const endWorking = this.getOrThrow<number>('END_WORKING')
		const activeMap = this.getOrThrow<boolean>('ACTIVE_MAP')

		return { startWorking, endWorking, activeMap }
	}

	setGeneral({ startWorking, endWorking, activeMap }: TypeGeneral) {
		if (startWorking !== undefined)
			this.set<number>('START_WORKING', startWorking)
		if (endWorking !== undefined) this.set<number>('END_WORKING', endWorking)
		if (activeMap !== undefined) this.set<boolean>('ACTIVE_MAP', activeMap)
	}
}
