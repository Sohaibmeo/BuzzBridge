import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/userDto';
import { JwtGuard } from '../guards/jwt.guard';
import { Request } from 'express';
import { User } from '../entity/user.entity';

//Note: New user is created by /email/register-user endpoint
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/find/currentUser')
  @UseGuards(JwtGuard)
  async findCUrrentUser(@Req() req: Request) {
    try {
      const { id } = req.user as User;
      return await this.userService.findOneById(id as number);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Param('page') page: number, @Param('limit') limit: number) {
    try {
      return await this.userService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async destroy(@Param('id') id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
  }
}
