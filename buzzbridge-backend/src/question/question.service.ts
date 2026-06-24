import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entity/question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { User } from '../entity/user.entity';
import { Topic } from '../entity/topic.entity';
import { VoteService } from '../vote/vote.service';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    private readonly voteService: VoteService,
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

  /**
   * Cursor-based pagination for top questions (by score)
   * Much faster than OFFSET/LIMIT for large datasets
   * @param limit Number of items to return
   * @param cursor Last item's cursor (score + id) from previous page
   */
  async findAllCursor(limit: number = 20, cursor?: string) {
    const query = this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.belongsTo', 'belongsTo')
      .orderBy('question.score', 'DESC')
      .addOrderBy('question.id', 'DESC') // Secondary sort for consistency
      .limit(limit + 1); // +1 to check if there's a next page

    // Apply cursor if provided
    if (cursor) {
      const [score, id] = cursor.split('_').map(Number);
      query.where(
        '(question.score < :score OR (question.score = :score AND question.id < :id))',
        { score, id },
      );
    }

    const questions = await query.getMany();
    const hasNextPage = questions.length > limit;

    // Remove extra item if exists
    if (hasNextPage) {
      questions.pop();
    }

    // Generate next cursor
    const nextCursor =
      questions.length > 0
        ? `${questions[questions.length - 1].score}_${questions[questions.length - 1].id}`
        : null;

    return {
      questions,
      hasNextPage,
      nextCursor,
    };
  }

  /**
   * Cursor-based pagination for latest questions (by creation date)
   * @param limit Number of items to return
   * @param cursor Last item's timestamp + id from previous page
   */
  async findAllLatestCursor(limit: number = 20, cursor?: string) {
    const query = this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.belongsTo', 'belongsTo')
      .orderBy('question.createdAt', 'DESC')
      .addOrderBy('question.id', 'DESC')
      .limit(limit + 1);

    if (cursor) {
      const [timestamp, id] = cursor.split('_');
      const createdAt = new Date(parseInt(timestamp));
      query.where(
        '(question.createdAt < :createdAt OR (question.createdAt = :createdAt AND question.id < :id))',
        { createdAt, id: Number(id) },
      );
    }

    const questions = await query.getMany();
    const hasNextPage = questions.length > limit;

    if (hasNextPage) {
      questions.pop();
    }

    const nextCursor =
      questions.length > 0
        ? `${questions[questions.length - 1].createdAt.getTime()}_${questions[questions.length - 1].id}`
        : null;

    return {
      questions,
      hasNextPage,
      nextCursor,
    };
  }

  /**
   * LEGACY: Keep existing methods for backward compatibility
   * Recommend migrating to cursor-based methods for better performance
   */
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

  /**
   * Cursor-based pagination for followed content (optimized for feeds)
   * This is typically the most used endpoint for user feeds
   */
  async findFollowedContentCursor(
    topics: Topic[],
    limit: number = 20,
    cursor?: string,
  ) {
    if (topics.length === 0) {
      return {
        questions: [],
        hasNextPage: false,
        nextCursor: null,
      };
    }

    const topicIds = topics.map((topic) => topic.id);
    const query = this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.assignedTopics', 'topic')
      .leftJoinAndSelect('question.belongsTo', 'belongsTo')
      .where('topic.id IN (:...topicIds)', { topicIds })
      .orderBy('question.score', 'DESC')
      .addOrderBy('question.id', 'DESC')
      .limit(limit + 1);

    if (cursor) {
      const [score, id] = cursor.split('_').map(Number);
      query.andWhere(
        '(question.score < :score OR (question.score = :score AND question.id < :id))',
        { score, id },
      );
    }

    const questions = await query.getMany();
    const hasNextPage = questions.length > limit;

    if (hasNextPage) {
      questions.pop();
    }

    const nextCursor =
      questions.length > 0
        ? `${questions[questions.length - 1].score}_${questions[questions.length - 1].id}`
        : null;

    return {
      questions,
      hasNextPage,
      nextCursor,
    };
  }

  /**
   * LEGACY: Keep for backward compatibility
   */
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
    return this.voteService.upvote('question', questionId, user);
  }

  async addDownvote(questionId: number, user: User) {
    return this.voteService.downvote('question', questionId, user);
  }

  async removeUpvote(questionId: number, user: User) {
    return this.voteService.removeUpvote('question', questionId, user);
  }

  async removeDownvote(questionId: number, user: User) {
    return this.voteService.removeDownvote('question', questionId, user);
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

  /**
   * Optimized search using PostgreSQL full-text search
   * Searches both title and description with relevance ranking
   */
  async searchOptimized(query: string, limit: number = 20) {
    // Clean and prepare search query
    const searchTerms = query
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => `${term}:*`)
      .join(' & ');

    if (!searchTerms) {
      return [];
    }

    return this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.belongsTo', 'belongsTo')
      .select([
        'question.id',
        'question.title',
        'question.description',
        'question.score',
        'question.createdAt',
        'belongsTo.id',
        'belongsTo.name',
        'belongsTo.username',
        'belongsTo.picture',
      ])
      .where(
        "to_tsvector('english', question.title || ' ' || COALESCE(question.description, '')) @@ to_tsquery('english', :searchTerms)",
        {
          searchTerms,
        },
      )
      .orderBy(
        "ts_rank(to_tsvector('english', question.title || ' ' || COALESCE(question.description, '')), to_tsquery('english', :searchTerms))",
        'DESC',
      )
      .addOrderBy('question.score', 'DESC') // Secondary sort by score
      .setParameter('searchTerms', searchTerms)
      .limit(limit)
      .getMany();
  }

  /**
   * LEGACY: Simple search - keep for backward compatibility
   */
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
