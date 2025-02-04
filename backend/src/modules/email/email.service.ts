import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { resetPasswordTemplate } from './templates/ResetPassword'
import { welcomeTemplate } from './templates/Welcome'

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	sendEmail(to: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to,
			subject,
			html
		})
	}

	async sendWelcomeEmail(email: string, password: string) {
		const html = await welcomeTemplate(password)
		return await this.sendEmail(email, 'Приветствуем вас в Astagam!', html)
	}

	async sendPasswordResetEmail(email: string, resetUrl: string) {
		const html = await resetPasswordTemplate(resetUrl)
		return await this.sendEmail(email, 'Запрос на восстановления пароля!', html)
	}
}
