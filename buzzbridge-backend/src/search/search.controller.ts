import { Controller, Get, Logger, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('query') query: string, @Query('type') type: string) {
    try {
      this.logger.log(`Searching for ${query} in ${type}`);
      return this.searchService.search(query, type);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
