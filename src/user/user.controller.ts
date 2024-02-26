import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/userDto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/userDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.userService.createUser(newUser);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
