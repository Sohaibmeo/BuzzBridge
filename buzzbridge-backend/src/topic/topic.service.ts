import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from '../entity/topic.entity';
import { Repository } from 'typeorm';
import { CreateTopicDto, UpdateTopicDto } from './dto/topicDto';
import { User } from '../entity/user.entity';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  async findOne(id: number) {
    try {
      const topic = await this.topicRepo.findOne({
        where: {
          id: id,
        },
        relations: ['belongsTo', 'followers'],
      });
      if (!topic) {
        throw new NotFoundException('Topic not found');
      }
      return topic;
    } catch (error) {
      throw error;
    }
  }
  async findAllByUserId(user: User, page: number, limit: number) {
    try {
      const topics = await this.topicRepo.find({
        where: { belongsTo: user },
        skip: (page - 1) * limit || 0,
        take: limit,
        relations: ['followers', 'belongsTo'],
      });
      return topics;
    } catch (error) {
      throw error;
    }
  }
  async findAll(page: number, limit: number) {
    try {
      return await this.topicRepo.find({
        skip: (page - 1) * limit || 0,
        take: limit,
        relations: ['followers', 'belongsTo'],
      });
    } catch (error) {
      return error.detail;
    }
  }

  async findTopicsFollowedByUserId(id: number, page: number, limit: number) {
    try {
      return await this.topicRepo
        .createQueryBuilder('topic')
        .leftJoinAndSelect('topic.followers', 'follower')
        .where('follower.id = :userId', { userId: id })
        .skip((page - 1) * limit || 0)
        .take(limit)
        .getMany();
    } catch (error) {
      return error.detail;
    }
  }

  async followTopic(topicId: number, user: User) {
    try {
      await this.topicRepo
        .createQueryBuilder()
        .relation(Topic, 'followers')
        .of(topicId)
        .add(user);
      return 'Success';
    } catch (error) {
      return error.detail;
    }
  }

  async unfollowTopic(topicId: number, user: User) {
    try {
      await this.topicRepo
        .createQueryBuilder()
        .relation(Topic, 'followers')
        .of(topicId)
        .remove(user);
      return 'Success';
    } catch (error) {
      return error.detail;
    }
  }

  async createTopic(newTopic: CreateTopicDto) {
    try {
      await this.topicRepo
        .createQueryBuilder()
        .insert()
        .into(Topic)
        .values(newTopic)
        .execute();
      return newTopic;
    } catch (error) {
      throw error.detail;
    }
  }

  async search(query: string) {
    try {
      return await this.topicRepo
        .createQueryBuilder('topic')
        .where('topic.title ilike :query', { query: `%${query}%` })
        .getMany();
    } catch (error) {
      throw error;
    }
  }

  async updateTopic(id: number, updatedTopic: UpdateTopicDto) {
    try {
      await this.topicRepo
        .createQueryBuilder()
        .update()
        .set(updatedTopic)
        .where({ id: id })
        .execute();
      return updatedTopic;
    } catch (error) {
      this.logger.error(error.detail);
      throw error;
    }
  }

  async deleteTopic(id: number) {
    try {
      this.topicRepo.createQueryBuilder().delete().where({ id: id }).execute();
      return 'deleted succesfully';
    } catch (error) {
      return error.detail;
    }
  }
}
