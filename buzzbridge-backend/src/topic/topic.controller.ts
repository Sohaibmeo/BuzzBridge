import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTopicDto, UpdateTopicDto } from './dto/topicDto';
import { TopicService } from './topic.service';
import { JwtGuard } from '../guards/jwt.guard';
import { Request } from 'express';
import { User } from '../entity/user.entity';

@Controller('topic')
export class TopicController {
  private readonly logger = new Logger(TopicController.name);
  constructor(private readonly topicService: TopicService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.topicService.findOne(id);
  }

  @Get('user/:userId/following')
  async findAllFollowedByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.topicService.findTopicsFollowedByUserId(
        userId,
        page,
        limit,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('user/:userId')
  async findAllByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.topicService.findAllByUserId(
        { id: userId } as User,
        page,
        limit,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':id/follow')
  @UseGuards(JwtGuard)
  async follow(@Param('id') id: number, @Req() request: Request) {
    try {
      await this.topicService.followTopic(id, request.user as User);
      return { message: 'Success' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':id/unfollow')
  @UseGuards(JwtGuard)
  async unfollow(@Param('id') id: number, @Req() request: Request) {
    try {
      await this.topicService.unfollowTopic(id, request.user as User);
      return { message: 'Success' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      return await this.topicService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() newTopic: CreateTopicDto, @Req() request: Request) {
    try {
      return await this.topicService.createTopic({
        ...newTopic,
        belongsTo: request.user as User,
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatedTopic: UpdateTopicDto) {
    try {
      return await this.topicService.updateTopic(id, updatedTopic);
    } catch (error) {
      throw new HttpException(error.detail, error.status);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.topicService.deleteTopic(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
