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
