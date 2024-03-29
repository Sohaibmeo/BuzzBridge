import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entity/question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { User } from '../entity/user.entity';
import { Topic } from '../entity/topic.entity';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async findOne(id: number) {
    try {
      const question = await this.questionRepo.findOne({
        where: {
          id: id,
        },
        relations: [
          'upvotedBy',
          'assignedTopics',
          'answers',
          'belongsTo',
          'downvotedBy',
        ],
      });
      if (!question) {
        throw new NotFoundException('User not found');
      }
      return question;
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number, limit: number) {
    try {
      return await this.questionRepo.find({
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
    //TODO: make this query sorted by ubvotes
  }

  async findAllLatest(page: number, limit: number) {
    try {
      return await this.questionRepo.find({
        relations: ['upvotedBy', 'downvotedBy', 'belongsTo'],
        skip: (page - 1) * limit || 0,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findFollowedContent(page: number, limit: number, topics: Topic[]) {
    try {
      const topicIds = topics.map((topic) => topic.id);
      return await this.questionRepo
        .createQueryBuilder('question')
        .leftJoinAndSelect('question.assignedTopics', 'topic')
        .where('topic.id IN (:...topicIds)', { topicIds })
        .leftJoinAndSelect('question.upvotedBy', 'upvotedBy')
        .leftJoinAndSelect('question.downvotedBy', 'downvotedBy')
        .leftJoinAndSelect('question.belongsTo', 'belongsTo')
        .skip(((page - 1) * limit) | 0)
        .take(limit)
        .orderBy('question.score', 'DESC')
        .getMany();
    } catch (error) {
      throw error;
    }
  }

  async findAllByUserId(user: User, page: number, limit: number) {
    try {
      return await this.questionRepo.find({
        where: { belongsTo: user },
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

  async findAllByTopicId(topicId: number, page: number, limit: number) {
    try {
      return await this.questionRepo.find({
        where: { assignedTopics: { id: topicId } },
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

  async addUpvote(questionId: number, user: User) {
    try {
      const question = await this.questionRepo.findOne({
        where: {
          id: questionId,
        },
        relations: ['downvotedBy'],
      });
      let score = question.score + 1;
      if (question.downvotedBy.some((downvoter) => downvoter.id === user.id)) {
        await this.questionRepo
          .createQueryBuilder()
          .relation(Question, 'downvotedBy')
          .of(questionId)
          .remove(user.id);
        score += 1;
      }
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'upvotedBy')
        .of(questionId)
        .add(user.id);
      await this.questionRepo
        .createQueryBuilder()
        .update(Question)
        .set({ score: score })
        .where('id = :id', { id: questionId })
        .execute();

      return 'Upvoted successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async addDownvote(questionId: number, user: User) {
    try {
      const question = await this.questionRepo.findOne({
        where: {
          id: questionId,
        },
        relations: ['upvotedBy'],
      });
      let score = question.score - 1;
      if (question.upvotedBy.some((upvoter) => upvoter.id === user.id)) {
        await this.questionRepo
          .createQueryBuilder()
          .relation(Question, 'upvotedBy')
          .of(questionId)
          .remove(user.id);
        score -= 1;
      }
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'downvotedBy')
        .of(questionId)
        .add(user.id);
      await this.questionRepo
        .createQueryBuilder()
        .update(Question)
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
      const question = await this.questionRepo.findOne({
        where: {
          id: questionId,
        },
      });
      const score = question.score - 1;
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'upvotedBy')
        .of(questionId)
        .remove(user.id);
      await this.questionRepo
        .createQueryBuilder()
        .update(Question)
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
      const question = await this.questionRepo.findOne({
        where: {
          id: questionId,
        },
      });
      const score = question.score + 1;
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'downvotedBy')
        .of(questionId)
        .remove(user.id);
      await this.questionRepo
        .createQueryBuilder()
        .update(Question)
        .set({ score: score })
        .where('id = :id', { id: questionId })
        .execute();
      return 'Downvote removed successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async createQuestion(newQuestion: CreateQuestionDto) {
    try {
      const values = { ...newQuestion, createdAt: new Date() };
      const question = await this.questionRepo
        .createQueryBuilder()
        .insert()
        .into(Question)
        .values(values)
        .execute();
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'assignedTopics')
        .of(question.identifiers[0].id)
        .add(newQuestion.assignedTopics);
      return 'Succesful';
    } catch (error) {
      throw error;
    }
  }

  async updateQuestion(id: number, updatedQuestion: UpdateQuestionDto) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .update()
        .set(updatedQuestion)
        .where({ id: id })
        .execute();
      return 'Question updated successfully';
    } catch (error) {
      throw error;
    }
  }

  async search(query: string) {
    try {
      return await this.questionRepo
        .createQueryBuilder('question')
        .where('question.title ilike :query', { query: `%${query}%` })
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteQuestion(id: number) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .delete()
        .where({ id: id })
        .execute();
      return 'Question deleted successfully';
    } catch (error) {
      throw error;
    }
  }
}
