import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { UserModule } from '../user/user.module';
import { QuestionModule } from '../question/question.module';
import { AnswerModule } from '../answer/answer.module';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [UserModule, QuestionModule, AnswerModule, TopicModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
