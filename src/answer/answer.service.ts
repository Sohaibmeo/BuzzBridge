import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entity/answer.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AnswerService {
  private readonly logger = new Logger(AnswerService.name);
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
  ) {}

  async findOne(id: number) {
    try {
      return await this.answerRepo.findOne({
        where: {
          id: id,
        },
        relations: ['upvotedBy', 'belongsTo'],
        order: {
          score: 'DESC',
        },
      });
    } catch (error) {
      return error;
    }
  }
  async findAllByUserId(user: User, page: number, limit: number) {
    try {
      return await this.answerRepo.find({
        where: { belongsTo: user },
        skip: (page - 1) * limit || 0,
        relations: ['upvotedBy', 'downvotedBy', 'belongsTo'],
        take: limit,
        order: {
          score: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findAllByQuestionId(questionId: number, page: number, limit: number) {
    try {
      return await this.answerRepo.find({
        where: { question: { id: questionId } },
        relations: ['upvotedBy', 'downvotedBy', 'belongsTo'],
        skip: (page - 1) * limit || 0,
        take: limit,
        order: {
          score: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async addUpvote(answerId: number, user: User) {
    try {
      const answer = await this.answerRepo.findOne({
        where: {
          id: answerId,
        },
        relations: ['downvotedBy'],
      });
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

      return 'Upvoted successfully';
    } catch (error) {
      console.log(error);
    }
  }
  async addDownvote(questionId: number, user: User) {
    try {
      const answer = await this.answerRepo.findOne({
        where: {
          id: questionId,
        },
        relations: ['upvotedBy'],
      });
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

      return 'Downvoted successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async removeUpvote(questionId: number, user: User) {
    try {
      const answer = await this.answerRepo.findOne({
        where: {
          id: questionId,
        },
      });
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
      return 'Upvote removed successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async removeDownvote(questionId: number, user: User) {
    try {
      const answer = await this.answerRepo.findOne({
        where: {
          id: questionId,
        },
      });
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
      return 'Downvote removed successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async createAnswer(newAnswer: CreateAnswerDto) {
    try {
      const reponse = await this.answerRepo
        .createQueryBuilder()
        .insert()
        .into(Answer)
        .values(newAnswer)
        .execute();
      return { message: 'Succesfully', id: reponse.identifiers[0].id };
    } catch (error) {
      return error.message;
    }
  }
  async updateAnswer(id: number, updatedAnswer: UpdateAnswerDto) {
    try {
      return await this.answerRepo
        .createQueryBuilder()
        .update()
        .set(updatedAnswer)
        .where({ id: id })
        .execute();
    } catch (error) {
      return error;
    }
  }
  async deleteAnswer(answerId: number) {
    try {
      await this.answerRepo
        .createQueryBuilder()
        .delete()
        .where({ id: answerId })
        .execute();
      return 'Deleted Succesfully';
    } catch (error) {
      return error;
    }
  }
}
