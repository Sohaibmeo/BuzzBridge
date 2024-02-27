import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTopicDto, UpdateTopicDto } from './dto/topicDto';
import { TopicService } from './topic.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/entity/user.entity';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.topicService.findOne(id);
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
  findAll() {
    return this.topicService.findAll();
  }
  @Post()
  @UseGuards(JwtGuard)
  create(@Body() newTopic: CreateTopicDto, @Req() request: Request) {
    return this.topicService.createTopic({
      ...newTopic,
      belongsTo: request.user as User,
    });
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatedTopic: UpdateTopicDto) {
    return this.topicService.updateTopic(id, updatedTopic);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.topicService.deleteTopic(id);
  }
}
