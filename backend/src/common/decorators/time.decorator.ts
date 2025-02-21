import { UseGuards } from '@nestjs/common'
import { CheckWorkTimeGuard } from '../guards/time.guard'

export const CheckWorkTime = () => UseGuards(CheckWorkTimeGuard)
