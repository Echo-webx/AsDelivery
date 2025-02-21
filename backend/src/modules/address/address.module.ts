import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AddressController } from './address.controller'
import { AddressService } from './address.service'

@Module({
	imports: [UserModule],
	controllers: [AddressController],
	providers: [AddressService]
})
export class AddressModule {}
