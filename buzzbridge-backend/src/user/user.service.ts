import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/userDto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneById(id: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.topics', 'topics')
      .leftJoinAndSelect('user.upvotedAnswers', 'upvotedAnswers')
      .leftJoinAndSelect('user.downvotedAnswers', 'downvotedAnswers')
      .leftJoinAndSelect('user.upvotedQuestions', 'upvotedQuestions')
      .leftJoinAndSelect('user.downvotedQuestions', 'downvotedQuestions')
      .select([
        'user',
        'topics.id',
        'upvotedAnswers.id',
        'downvotedAnswers.id',
        'upvotedQuestions.id',
        'downvotedQuestions.id',
      ])
      .getOne();
  }

  async updateUserPassword(user: User, password: string) {
    const newPassword = await bcrypt.hash(password, 10);
    const result = await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ password: newPassword })
      .where({ id: user.id })
      .execute();
    return result;
  }

  findAll(page: number, limit: number) {
    return this.userRepository.find({
      skip: (page - 1) * limit || 0,
      take: limit,
    });
  }

  findAndGetTopics(user: User) {
    return this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: ['topics'],
      select: ['topics', 'id'],
    });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'password', 'email'],
    });
  }

  async getUserInfo(email: string) {
    try {
      const user = await this.findOneByEmail(email);
      if (user) {
        throw new BadRequestException('Email already exist');
      }
      const splitEmail = email.split('@');
      const randomString = Math.random().toString(36).substring(2);
      const createUserBody = {
        username: splitEmail[0] + randomString,
        password: Math.random().toString(36).substring(2),
        email,
        name: splitEmail[0],
      };
      return createUserBody;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async search(query: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.name ilike :query', { query: `%${query}%` })
      .getMany();
    return users;
  }

  async registerUser(userBody: CreateUserDto) {
    await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(userBody)
      .execute();
    return userBody;
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set(updateUser)
      .where({ id: id })
      .execute();
    return;
  }

  deleteUser(id: number) {
    this.userRepository
      .createQueryBuilder()
      .delete()
      .where({ id: id })
      .execute();
    return;
  }

  deleteUserByEmail(email: string) {
    this.userRepository.createQueryBuilder().delete().where({ email: email })
      .execute;
    return;
  }
}
