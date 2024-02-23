import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTopicDto, UpdateTopicDto } from './dto/topicDto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.topicService.findOne(id);
  }
  @Get()
  findAll() {
    return this.topicService.findAll();
  }
  @Post()
  create(@Body() newTopic: CreateTopicDto) {
    return this.topicService.createTopic(newTopic);
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
