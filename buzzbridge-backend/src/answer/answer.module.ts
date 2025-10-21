import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../entity/answer.entity';
import { VoteModule } from '../vote/vote.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), VoteModule],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
