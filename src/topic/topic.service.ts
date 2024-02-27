import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/entity/topic.entity';
import { Repository } from 'typeorm';
import { CreateTopicDto, UpdateTopicDto } from './dto/topicDto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  async findOne(id: number) {
    return this.topicRepo.findOne({
      where: {
        id: id,
      },
      relations: [
        'belongsTo',
        'followers',
        'questions',
        'questions.belongsTo',
        'questions.upvotedBy',
        'questions.downvotedBy',
      ],
    });
  }
  async findAllByUserId(user: User, page: number, limit: number) {
    try {
      return await this.topicRepo.find({
        where: { belongsTo: user },
        skip: (page - 1) * limit || 0,
        take: limit,
      });
    } catch (error) {
      throw error;
    }
  }
  async findAll() {
    try {
      return await this.topicRepo.find({
        relations: ['belongsTo'],
      });
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
      return 'Succesful';
    } catch (error) {
      return 'This is an error :' + error.detail;
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
      return 'updated succesfully';
    } catch (error) {
      return error.detail;
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
