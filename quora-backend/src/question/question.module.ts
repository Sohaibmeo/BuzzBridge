import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/entity/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
