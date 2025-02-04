import { Type } from 'class-transformer'
import {
	IsDate,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	Min
} from 'class-validator'
import { IsMongoIdOrAll } from '../validators/IaMongoIdOrAll'

export class CheckId {
	@IsOptional()
	@IsMongoId()
	id?: string

	@IsOptional()
	@IsMongoId()
	userId?: string

	@IsOptional()
	@IsMongoId()
	regionId?: string

	@IsOptional()
	@IsMongoId()
	productId?: string

	@IsOptional()
	@IsMongoId()
	itemId?: string
}

export class Token {
	@IsNotEmpty()
	@IsString()
	token: string
}

export class SearchQuery {
	@IsOptional()
	@IsString()
	search?: string
}

export class SearchWeek {
	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{4}-W\d{2}$/)
	week: string
}

export class Search {
	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Type(() => Number)
	page: number

	@IsNotEmpty()
	@IsNumber({ allowNaN: false, allowInfinity: false })
	@Min(0)
	@Type(() => Number)
	limit: number

	@IsOptional()
	@IsString()
	search?: string
}

export class SearchIndex {
	@IsOptional()
	@IsString()
	@IsMongoIdOrAll()
	index?: string

	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	date: Date

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	dateTo: Date
}

export class SearchOrIndex extends Search {
	@IsOptional()
	@IsString()
	@IsMongoIdOrAll()
	index?: string

	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	date: Date

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	dateTo: Date
}

export class SearchOrWeek extends Search {
	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{4}-W\d{2}$/)
	week: string
}
