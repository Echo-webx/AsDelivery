import { Controller, Get, Query } from '@nestjs/common'
import { User } from '@prisma/client'
import { SearchQuery } from 'src/common/dto/main.dto'
import { Auth } from '../../common/decorators/auth.decorator'
import { CurrentUser } from '../../common/decorators/user.decorator'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	@Auth()
	async get(@Query() query: SearchQuery, @CurrentUser() user: User) {
		return this.searchService.get(user, query.search)
	}
}
