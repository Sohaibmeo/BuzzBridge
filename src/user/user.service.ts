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

  //TODO: check this logic later
  async updateUserPassword(
    id: number,
    user,
    oldPassword: string,
    newPassword: string,
  ) {
    const userInDb = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!userInDb) {
      throw new NotFoundException('User not found');
    }
    if (userInDb.id !== user.id) {
      throw new NotFoundException('User not found');
    }
    const passwordMatch = await bcrypt.compare(oldPassword, userInDb.password);
    if (!passwordMatch) {
      throw new NotFoundException('Password does not match');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ password: hashedPassword })
      .where({ id: id })
      .execute();
    return 'Password updated';
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
