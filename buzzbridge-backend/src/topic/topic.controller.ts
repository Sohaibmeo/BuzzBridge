import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
  findOne(@Param('id') id: number) {
    return this.topicService.findOne(id);
  }

  @Get('user/:userId/following')
  findAllFollowedByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.topicService.findTopicsFollowedByUserId(userId, page, limit);
  }

  @Get('user/:userId')
  findAllByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.topicService.findAllByUserId(
      { id: userId } as User,
      page,
      limit,
    );
  }

  @Post(':id/follow')
  @UseGuards(JwtGuard)
  async follow(@Param('id') id: number, @Req() request: Request) {
    return await this.topicService.followTopic(id, request.user as User);
  }

  @Post(':id/unfollow')
  @UseGuards(JwtGuard)
  async unfollow(@Param('id') id: number, @Req() request: Request) {
    return await this.topicService.unfollowTopic(id, request.user as User);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.topicService.findAll(page, limit);
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
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatedTopic: UpdateTopicDto) {
    try {
      return await this.topicService.updateTopic(id, updatedTopic);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.topicService.deleteTopic(id);
  }
}
