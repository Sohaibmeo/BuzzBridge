import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../entity/answer.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class AnswerService {
  private readonly logger = new Logger(AnswerService.name);
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
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
    const answer = await this.answerRepo.findOne({
      where: {
        id: answerId,
      },
      relations: ['downvotedBy', 'upvotedBy'],
      select: ['id', 'score'],
    });
    if (answer.upvotedBy.some((upvoter) => upvoter.id === user.id)) {
      throw new Error('Already upvoted');
    }
    let score = answer.score + 1;
    if (answer.downvotedBy.some((downvoter) => downvoter.id === user.id)) {
      await this.answerRepo
        .createQueryBuilder()
        .relation(Answer, 'downvotedBy')
        .of(answer)
        .remove(user.id);
      score += 1;
    }
    await this.answerRepo
      .createQueryBuilder()
      .relation(Answer, 'upvotedBy')
      .of(answer)
      .add(user.id);
    await this.answerRepo
      .createQueryBuilder()
      .update(Answer)
      .set({ score: score })
      .where('id = :id', { id: answer.id })
      .execute();
    return;
  }
  async addDownvote(questionId: number, user: User) {
    const answer = await this.answerRepo.findOne({
      where: {
        id: questionId,
      },
      relations: ['upvotedBy', 'downvotedBy'],
      select: ['id', 'score'],
    });
    if (answer.downvotedBy.some((downvoter) => downvoter.id === user.id)) {
      throw new Error('Already downvoted');
    }
    let score = answer.score - 1;
    if (answer.upvotedBy.some((upvoter) => upvoter.id === user.id)) {
      await this.answerRepo
        .createQueryBuilder()
        .relation(Answer, 'upvotedBy')
        .of(questionId)
        .remove(user.id);
      score -= 1;
    }
    await this.answerRepo
      .createQueryBuilder()
      .relation(Answer, 'downvotedBy')
      .of(questionId)
      .add(user.id);
    await this.answerRepo
      .createQueryBuilder()
      .update(Answer)
      .set({ score: score })
      .where('id = :id', { id: questionId })
      .execute();
    return;
  }

  async removeUpvote(questionId: number, user: User) {
    const answer = await this.answerRepo.findOne({
      where: {
        id: questionId,
      },
      relations: ['upvotedBy', 'downvotedBy'],
      select: ['id', 'score'],
    });
    if (!answer.upvotedBy.some((upvoter) => upvoter.id === user.id)) {
      throw new Error('Not upvoted');
    }
    const score = answer.score - 1;
    await this.answerRepo
      .createQueryBuilder()
      .relation(Answer, 'upvotedBy')
      .of(questionId)
      .remove(user.id);
    await this.answerRepo
      .createQueryBuilder()
      .update(Answer)
      .set({ score: score })
      .where('id = :id', { id: questionId })
      .execute();
    return;
  }

  async removeDownvote(questionId: number, user: User) {
    const answer = await this.answerRepo.findOne({
      where: {
        id: questionId,
      },
      relations: ['upvotedBy', 'downvotedBy'],
      select: ['id', 'score'],
    });
    if (!answer.downvotedBy.some((downvoter) => downvoter.id === user.id)) {
      throw new Error('Not downvoted');
    }
    const score = answer.score + 1;
    await this.answerRepo
      .createQueryBuilder()
      .relation(Answer, 'downvotedBy')
      .of(questionId)
      .remove(user.id);
    await this.answerRepo
      .createQueryBuilder()
      .update(Answer)
      .set({ score: score })
      .where('id = :id', { id: questionId })
      .execute();
    return;
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
