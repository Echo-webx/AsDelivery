import { Global, Module } from '@nestjs/common'
import { ExtConfigService } from './services/config.service'
import { PrismaService } from './services/prisma.service'

@Global()
@Module({
	providers: [PrismaService, ExtConfigService],
	exports: [PrismaService, ExtConfigService]
})
export class GlobalModule {}
