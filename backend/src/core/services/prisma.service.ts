import {
	BadRequestException,
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	async onModuleInit() {
		Logger.log('[Prisma] Connecting...')
		await this.$connect()
	}

	async onModuleDestroy() {
		Logger.log('[Prisma] Disconnecting...')
		await this.$disconnect()
	}
}

export function filterUndefined(obj: Record<string, any>): Record<string, any> {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, v]) => v !== undefined)
	)
}

interface PrismaErrorProps {
	notFound?: string
	notUnique?: string
}

export function handlePrismaError(
	err: any,
	other: string,
	{ notFound, notUnique }: PrismaErrorProps
): void {
	if (err.code === 'P2025' && notFound) {
		throw new BadRequestException(notFound)
	}
	if (err.code === 'P2002' && notUnique)
		throw new BadRequestException(notUnique)
	throw new BadRequestException(other)
}
