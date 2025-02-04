import { UseGuards } from '@nestjs/common'
import { CheckWorkRegionGuard } from '../guards/region.guard'

export const CheckWorkRegion = () => UseGuards(CheckWorkRegionGuard)
