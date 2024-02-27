import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/userDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/userDto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findAll() {
    return await this.userRepository.find({
      relations: {
        answers: true,
        topics: true,
        createdTopics: true,
      },
    });
  }

  async createUser(userGiven: CreateUserDto) {
    try {
      // eslint-disable-next-line
      let { password, ...rest } = userGiven;
      password = await bcrypt.hash(password, 10);
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...userGiven, password })
        .execute();
      return 'Succesful';
    } catch (error) {
      this.logger.error(error.detail);
      return error.detail;
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    try {
      await this.userRepository
        .createQueryBuilder()
        .update()
        .set(updateUser)
        .where({ id: id })
        .execute();
      return 'user updated';
    } catch (error) {
      return error.detail;
    }
  }

  deleteUser(id: number) {
    try {
      this.userRepository
        .createQueryBuilder()
        .delete()
        .where({ id: id })
        .execute();
      return 'user deleted';
    } catch (error) {
      return error.detail;
    }
  }
}
