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
  findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }

  @Get('/find/currentUser')
  @UseGuards(JwtGuard)
  findCUrrentUser(@Req() req: Request) {
    const { id } = req.user as User;
    return this.userService.findOneById(id as number);
  }

  @Get()
  findAll(@Param('page') page: number, @Param('limit') limit: number) {
    return this.userService.findAll(page, limit);
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
