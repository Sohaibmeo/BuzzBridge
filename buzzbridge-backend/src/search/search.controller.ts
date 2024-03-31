import { Controller, Get, Logger, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('query') query: string, @Query('type') type: string) {
    return this.searchService.search(query, type);
  }
}
