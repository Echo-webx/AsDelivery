import { Module } from '@nestjs/common'
import { AddressModule } from '../modules/address/address.module'
import { AuthModule } from '../modules/auth/auth.module'
import { EmailModule } from '../modules/email/email.module'
import { GeneralModule } from '../modules/general/general.module'
import { ProductModule } from '../modules/product/product.module'
import { ReceptionModule } from '../modules/reception/reception.module'
import { RegionModule } from '../modules/region/region.module'
import { ReleaseModule } from '../modules/release/release.module'
import { SalaryModule } from '../modules/salary/salary.module'
import { SearchModule } from '../modules/search/search.module'
import { UserModule } from '../modules/user/user.module'
import { WorkloadModule } from '../modules/workload/workload.module'
import { GlobalModule } from './global.module'

@Module({
	imports: [
		GlobalModule,
		AuthModule,
		UserModule,
		GeneralModule,
		RegionModule,
		AddressModule,
		ProductModule,
		ReleaseModule,
		WorkloadModule,
		SalaryModule,
		ReceptionModule,
		EmailModule,
		SearchModule
	]
})
export class CoreModule {}
