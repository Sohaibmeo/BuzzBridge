import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserPasswordDto } from './dto/userDto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/userDto';
import { JwtGuard } from '../guards/jwt.guard';
import { LocalGuard } from '../guards/local.guard';
import { Request } from 'express';
import { User } from '../entity/user.entity';

//Note: New user is created by /email/register-user endpoint
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }

  @Get('/find/currentUser')
  @UseGuards(JwtGuard)
  async findCUrrentUser(@Req() req: Request) {
    const { id } = req.user as User;
    return this.userService.findOneById(id as number);
  }

  @Patch('/password')
  @UseGuards(LocalGuard, JwtGuard)
  async updatePassword(
    @Req() request: Request,
    @Body() UpdateUserPassword: UpdateUserPasswordDto,
  ) {
    const { newPassword } = UpdateUserPassword;
    return await this.userService.updateUserPassword(
      request.user as User,
      newPassword,
    );
  }

  @Get()
  async findAll(@Param('page') page: number, @Param('limit') limit: number) {
    return await this.userService.findAll(page, limit);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
