import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateAnswerDto,
  UpdateAnswerDto,
  UpvoteAnswerDto,
} from './dto/answer.dto';
import { AnswerService } from './answer.service';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.answerService.findOne(id);
  }

  @Get(':answerId/upvote')
  getUpvoteCount(@Param('answerId') answerId: number) {
    return this.answerService.getUpvoteCount(answerId);
  }

  @Post(':answerId/upvote')
  upvote(@Param('answerId') answerId: number, @Body() data: UpvoteAnswerDto) {
    return this.answerService.addUpvote(answerId, data.upvotedBy);
  }

  @Post(':answerId/downvote')
  downvote(@Param('answerId') answerId: number, @Body() data: UpvoteAnswerDto) {
    return this.answerService.removeUpvote(answerId, data.upvotedBy);
  }

  @Post()
  create(@Body() newAnswer: CreateAnswerDto) {
    return this.answerService.createAnswer(newAnswer);
  }

  @Patch(':id')
  updateAnswer(
    @Param('id') id: number,
    @Body() updatedAnswer: UpdateAnswerDto,
  ) {
    return this.answerService.updateAnswer(id, updatedAnswer);
  }

  @Delete(':id')
  removeAnswer(@Param('id') id: number) {
    return this.answerService.deleteAnswer(id);
  }
}
