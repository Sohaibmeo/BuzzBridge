import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../entity/answer.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';
import { User } from '../entity/user.entity';
import { VoteService } from '../vote/vote.service';

@Injectable()
export class AnswerService {
  private readonly logger = new Logger(AnswerService.name);
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    private readonly voteService: VoteService,
  ) {}

  findOne(id: number) {
    return this.answerRepo.findOne({
      where: {
        id: id,
      },
      relations: ['belongsTo'],
      order: {
        score: 'DESC',
      },
    });
  }
  findAllByUserId(user: User, page: number, limit: number) {
    return this.answerRepo.find({
      where: { belongsTo: user },
      skip: (page - 1) * limit || 0,
      relations: ['belongsTo'],
      take: limit,
      order: {
        score: 'DESC',
      },
    });
  }
  findAllByQuestionId(questionId: number, page: number, limit: number) {
    return this.answerRepo.find({
      where: { question: { id: questionId } },
      relations: ['belongsTo'],
      skip: (page - 1) * limit || 0,
      take: limit,
      order: {
        score: 'DESC',
      },
    });
  }

  async addUpvote(answerId: number, user: User) {
    return this.voteService.upvote('answer', answerId, user);
  }
  async addDownvote(answerId: number, user: User) {
    return this.voteService.downvote('answer', answerId, user);
  }

  async removeUpvote(answerId: number, user: User) {
    return this.voteService.removeUpvote('answer', answerId, user);
  }

  async removeDownvote(answerId: number, user: User) {
    return this.voteService.removeDownvote('answer', answerId, user);
  }

  async createAnswer(newAnswer: CreateAnswerDto) {
    await this.answerRepo
      .createQueryBuilder()
      .insert()
      .into(Answer)
      .values(newAnswer)
      .execute();
    return newAnswer;
  }
  async updateAnswer(id: number, updatedAnswer: UpdateAnswerDto) {
    await this.answerRepo
      .createQueryBuilder()
      .update()
      .set(updatedAnswer)
      .where({ id: id })
      .execute();
    return;
  }
  async deleteAnswer(answerId: number) {
    await this.answerRepo
      .createQueryBuilder()
      .delete()
      .where({ id: answerId })
      .execute();
    return 'Deleted Succesfully';
  }
}
