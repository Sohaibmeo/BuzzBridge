import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from './topic/topic.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import config from '../ormconfig';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(
    config
  ), TopicModule, AnswerModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
