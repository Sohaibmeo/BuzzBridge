import { Injectable, Logger } from '@nestjs/common';
import { QuestionService } from '../question/question.service';
import { TopicService } from '../topic/topic.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  constructor(
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly topicService: TopicService,
  ) {}

  /**
   * Optimized search using PostgreSQL full-text search
   * Much faster than ILIKE queries with relevance ranking
   */
  async searchOptimized(query: string, type: string, limit: number = 20) {
    if (type === 'users') {
      return this.userService.searchOptimized(query, limit);
    } else if (type === 'questions') {
      return this.questionService.searchOptimized(query, limit);
    } else if (type === 'topics') {
      return this.topicService.searchOptimized(query, limit);
    } else {
      return [];
    }
  }

  /**
   * LEGACY: Keep for backward compatibility
   * Recommend using searchOptimized for better performance
   */
  search(query: string, type: string) {
    if (type === 'users') {
      return this.userService.search(query);
    } else if (type === 'questions') {
      return this.questionService.search(query);
    } else if (type === 'topics') {
      return this.topicService.search(query);
    } else {
      return [];
    }
  }
}
