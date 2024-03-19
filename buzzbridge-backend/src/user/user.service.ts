import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
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
      select: ['id', 'username', 'password', 'email', 'name', 'picture'],
    });
  }

  async findAll(page: number, limit: number) {
    return await this.userRepository.find({
      skip: (page - 1) * limit || 0,
      take: limit,
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async registerUser(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      if (user) {
        throw new Error('Email already exists');
      }
      const splitEmail = email.split('@');
      const createUserBody = {
        username: splitEmail[0],
        password: Math.random().toString(36).substring(2),
        email,
        name: splitEmail[0],
      };
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(createUserBody)
        .execute();
      return createUserBody;
    } catch (error) {
      throw error;
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
