import { forwardRef, Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { SalaryController } from './salary.controller'
import { SalaryService } from './salary.service'

@Module({
	imports: [forwardRef(() => UserModule)],
	controllers: [SalaryController],
	providers: [SalaryService],
	exports: [SalaryService]
})
export class SalaryModule {}
