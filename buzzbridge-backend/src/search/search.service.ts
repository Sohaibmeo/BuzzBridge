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
  async search(query: string, type: string) {
    try {
      if (type === 'users') {
        return await this.userService.search(query);
      } else if (type === 'questions') {
        return await this.questionService.search(query);
      } else if (type === 'topics') {
        return await this.topicService.search(query);
      } else {
        return [];
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
