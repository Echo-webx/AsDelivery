import { Module } from '@nestjs/common'
import { ProductModule } from '../product/product.module'
import { ReceptionController } from './reception.controller'
import { ReceptionService } from './reception.service'

@Module({
	imports: [ProductModule],
	controllers: [ReceptionController],
	providers: [ReceptionService]
})
export class ReceptionModule {}
