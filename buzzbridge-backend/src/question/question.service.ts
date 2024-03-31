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
    const question = await this.questionRepo.findOne({
      where: {
        id: id,
      },
      relations: ['assignedTopics', 'answers', 'belongsTo'],
    });
    if (!question) {
      throw new NotFoundException('User not found');
    }
    return question;
  }

  findAll(page: number, limit: number) {
    return this.questionRepo.find({
      relations: ['belongsTo'],
      skip: (page - 1) * limit || 0,
      take: limit,
      order: {
        score: 'DESC',
      },
    });
  }

  findAllLatest(page: number, limit: number) {
    return this.questionRepo.find({
      relations: ['belongsTo'],
      skip: (page - 1) * limit || 0,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findFollowedContent(page: number, limit: number, topics: Topic[]) {
    if (topics.length === 0) {
      return [];
    }
    const topicIds = topics.map((topic) => topic.id);
    return this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.assignedTopics', 'topic')
      .where('topic.id IN (:...topicIds)', { topicIds: topicIds })
      .leftJoinAndSelect('question.belongsTo', 'belongsTo')
      .skip((page - 1) * limit || 0)
      .take(limit)
      .orderBy('question.score', 'DESC')
      .getMany();
  }

  findAllByUserId(user: User, page: number, limit: number) {
    return this.questionRepo.find({
      where: { belongsTo: user },
      relations: ['belongsTo'],
      skip: (page - 1) * limit || 0,
      take: limit,
      order: {
        score: 'DESC',
      },
    });
  }

  findAllByTopicId(topicId: number, page: number, limit: number) {
    return this.questionRepo.find({
      where: { assignedTopics: { id: topicId } },
      relations: ['belongsTo'],
      skip: (page - 1) * limit || 0,
      take: limit,
      order: {
        score: 'DESC',
      },
    });
  }

  async addUpvote(questionId: number, user: User) {
    const question = await this.questionRepo.findOne({
      where: {
        id: questionId,
      },
      relations: ['downvotedBy', 'upvotedBy'],
      select: ['id', 'score'],
    });
    if (question.upvotedBy.some((upvoter) => upvoter.id === user.id)) {
      throw new Error('Already upvoted this question');
    }
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

    return;
  }

  async addDownvote(questionId: number, user: User) {
    const question = await this.questionRepo.findOne({
      where: {
        id: questionId,
      },
      relations: ['upvotedBy', 'downvotedBy'],
      select: ['id', 'score'],
    });
    if (question.downvotedBy.some((downvoter) => downvoter.id === user.id)) {
      throw new Error('Already downvoted this question');
    }
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

    return;
  }

  async removeUpvote(questionId: number, user: User) {
    const question = await this.questionRepo.findOne({
      where: {
        id: questionId,
      },
      relations: ['upvotedBy'],
      select: ['id', 'score'],
    });
    if (!question.upvotedBy.some((upvoter) => upvoter.id === user.id)) {
      throw new Error('Cannot remove upvote');
    }
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
    return;
  }

  async removeDownvote(questionId: number, user: User) {
    const question = await this.questionRepo.findOne({
      where: {
        id: questionId,
      },
      relations: ['downvotedBy'],
      select: ['id', 'score'],
    });
    if (!question.downvotedBy.some((downvoter) => downvoter.id === user.id)) {
      throw new Error('Cannot remove downvote');
    }
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
    return;
  }

  async createQuestion(newQuestion: CreateQuestionDto) {
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
    return;
  }

  async updateQuestion(id: number, updatedQuestion: UpdateQuestionDto) {
    await this.questionRepo
      .createQueryBuilder()
      .update()
      .set(updatedQuestion)
      .where({ id: id })
      .execute();
    return;
  }

  search(query: string) {
    return this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.belongsTo', 'belongsTo')
      .where('question.title ilike :query', { query: `%${query}%` })
      .getMany();
  }

  async deleteQuestion(id: number) {
    await this.questionRepo
      .createQueryBuilder()
      .delete()
      .where({ id: id })
      .execute();
    return;
  }
}
