import { Module } from '@nestjs/common'
import { ProductModule } from 'src/modules/product/product.module'
import { UserModule } from 'src/modules/user/user.module'
import { WorkloadController } from './workload.controller'
import { WorkloadService } from './workload.service'

@Module({
	imports: [ProductModule, UserModule],
	controllers: [WorkloadController],
	providers: [WorkloadService]
})
export class WorkloadModule {}
