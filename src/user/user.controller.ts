import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserPasswordDto } from './dto/userDto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/userDto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { LocalGuard } from 'src/guards/local.guard';
import { Request } from 'express';
import { User } from 'src/entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }

  @Patch('/password')
  @UseGuards(LocalGuard, JwtGuard)
  updatePassword(
    @Req() request: Request,
    @Body() UpdateUserPassword: UpdateUserPasswordDto,
  ) {
    const { newPassword } = UpdateUserPassword;
    return this.userService.updateUserPassword(
      request.user as User,
      newPassword,
    );
  }

  @Get()
  async findAll(@Param('page') page: number, @Param('limit') limit: number) {
    return await this.userService.findAll(page, limit);
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.userService.createUser(newUser);
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
