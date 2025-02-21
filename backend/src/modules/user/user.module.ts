import { forwardRef, Module } from '@nestjs/common'
import { EmailModule } from '../email/email.module'
import { RegionModule } from '../region/region.module'
import { SalaryModule } from '../salary/salary.module'
import { UserGetByService } from './user-getBy.service'
import { UserRelationController } from './user-relation.controller'
import { UserRelationService } from './user-relation.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [RegionModule, forwardRef(() => SalaryModule), EmailModule],
	controllers: [UserController, UserRelationController],
	providers: [UserService, UserRelationService, UserGetByService],
	exports: [UserService, UserRelationService, UserGetByService]
})
export class UserModule {}
