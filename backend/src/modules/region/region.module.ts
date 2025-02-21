import { Module } from '@nestjs/common'
import { RegionController } from './region.controller'
import { RegionService } from './region.service'

@Module({
	controllers: [RegionController],
	providers: [RegionService],
	exports: [RegionService]
})
export class RegionModule {}
