import { MailerOptions } from '@nestjs-modules/mailer'
import { isDev } from 'src/common/utils/is-dev.util'
import { ExtConfigService } from 'src/core/services/config.service'

export const getEmailConfig = async (
	config: ExtConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: config.getOrThrow<string>('SMTP_HOST'),
		port: !isDev(config) ? 465 : 587,
		secure: !isDev(config),
		auth: {
			user: config.getOrThrow<string>('SMTP_USER'),
			pass: config.getOrThrow<string>('SMTP_PASS')
		},
		defaults: {
			from: '"Astagam" <no-reply@example.com>'
		}
	}
})
