import { Module } from '@nestjs/common'
import { ReleaseStatisticsController } from './release-statistics.controller'
import { ReleaseStatisticsService } from './release-statistics.service'
import { ReleaseController } from './release.controller'
import { ReleaseService } from './release.service'

@Module({
	controllers: [ReleaseController, ReleaseStatisticsController],
	providers: [ReleaseService, ReleaseStatisticsService]
})
export class ReleaseModule {}
