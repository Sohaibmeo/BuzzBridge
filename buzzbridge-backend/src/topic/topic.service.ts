import { Injectable, Logger } from '@nestjs/common';
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
    const topic = await this.topicRepo.findOne({
      where: {
        id: id,
      },
      relations: ['belongsTo'],
    });
    if (!topic) {
      throw new Error('Topic not found');
    }
    return topic;
  }
  findAllByUserId(user: User, page: number, limit: number) {
    return this.topicRepo.find({
      where: { belongsTo: user },
      skip: (page - 1) * limit || 0,
      take: limit,
      relations: ['belongsTo'],
    });
  }
  findAll(page: number, limit: number) {
    return this.topicRepo.find({
      skip: (page - 1) * limit || 0,
      take: limit,
      relations: ['belongsTo'],
    });
  }

  async findTopicsFollowedByUserId(id: number, page: number, limit: number) {
    return this.topicRepo
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.followers', 'follower')
      .where('follower.id = :userId', { userId: id })
      .skip((page - 1) * limit || 0)
      .take(limit)
      .getMany();
  }

  async followTopic(topicId: number, user: User) {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId },
      relations: ['followers'],
      select: ['id', 'followCount'],
    });
    if (topic.followers.some((follower: User) => user.id === follower.id)) {
      throw new Error('Already following');
    }
    const count = (topic.followCount += 1);
    await this.topicRepo
      .createQueryBuilder()
      .relation(Topic, 'followers')
      .of(topicId)
      .add(user);
    await this.topicRepo
      .createQueryBuilder()
      .update(Topic)
      .set({ followCount: count })
      .where('id = :id', { id: topicId })
      .execute();
    return;
  }

  async unfollowTopic(topicId: number, user: User) {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId },
      relations: ['followers'],
      select: ['id', 'followCount'],
    });
    if (!topic.followers.some((follower: User) => user.id === follower.id)) {
      throw new Error('Not following');
    }
    const count = (topic.followCount -= 1);
    await this.topicRepo
      .createQueryBuilder()
      .relation(Topic, 'followers')
      .of(topicId)
      .remove(user);
    await this.topicRepo
      .createQueryBuilder()
      .update(Topic)
      .set({ followCount: count })
      .where('id = :id', { id: topicId })
      .execute();
    return;
  }

  async createTopic(newTopic: CreateTopicDto) {
    await this.topicRepo
      .createQueryBuilder()
      .insert()
      .into(Topic)
      .values(newTopic)
      .execute();
    return newTopic;
  }

  search(query: string) {
    return this.topicRepo
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.belongsTo', 'belongsTo')
      .where('topic.title ilike :query', { query: `%${query}%` })
      .getMany();
  }

  async updateTopic(id: number, updatedTopic: UpdateTopicDto) {
    await this.topicRepo
      .createQueryBuilder()
      .update()
      .set(updatedTopic)
      .where({ id: id })
      .execute();
    return updatedTopic;
  }

  async deleteTopic(id: number) {
    await this.topicRepo
      .createQueryBuilder()
      .delete()
      .where({ id: id })
      .execute();
    return;
  }
}
