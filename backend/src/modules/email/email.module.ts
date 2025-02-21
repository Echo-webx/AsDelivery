import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ExtConfigService } from 'src/core/services/config.service'
import { getEmailConfig } from '../../config/email.config'
import { EmailService } from './email.service'

@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [ExtConfigService],
			useFactory: getEmailConfig
		})
	],
	providers: [EmailService],
	exports: [EmailService]
})
export class EmailModule {}
