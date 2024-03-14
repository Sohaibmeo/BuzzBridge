import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateUserPassword(user: User, password: string) {
    try {
      const newPassword = await bcrypt.hash(password, 10);
      const result = await this.userRepository
        .createQueryBuilder()
        .update()
        .set({ password: newPassword })
        .where({ id: user.id })
        .execute();
      this.logger.log('Password updated');
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
      select: ['id', 'username', 'password'],
    });
  }

  async findAll(page: number, limit: number) {
    return await this.userRepository.find({
      skip: (page - 1) * limit || 0,
      take: limit,
    });
  }

  async registerUser(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      if (user) {
        return 'Email already exists';
      }
      const password = Math.random().toString(36).substring(18);
      const splitEmail = email.split('@');
      const name = splitEmail[0];
      const createUserBody = {
        username: name,
        password,
        email,
        name,
      };
      //create user
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(createUserBody)
        .execute();
    } catch (error) {
      this.logger.error(error);
      return error.detail;
    }
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
