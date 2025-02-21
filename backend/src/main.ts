import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { isDev } from './common/utils/is-dev.util'
import { CoreModule } from './core/core.module'
import { ExtConfigService } from './core/services/config.service'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(CoreModule)

	const config = app.get(ExtConfigService)
	const urls = config
		.getOrThrow<string>('FRONTEND_URL')
		?.split(',')
		?.map(url => url.trim())

	app.setGlobalPrefix('api')

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Удаляет свойства, которые не указаны в DTO
			transform: true // Преобразует входные данные в нужные типы
			// forbidNonWhitelisted: true, Выбрасывает ошибку, если есть дополнительные свойства
		})
	)

	app.use(helmet({ contentSecurityPolicy: !isDev(config) }))
	app.use(cookieParser())

	app.enableCors({
		origin: urls,
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	app.disable('x-powered-by')

	await app.listen(config.get<number>('PORT') || 4000)
}
bootstrap()
