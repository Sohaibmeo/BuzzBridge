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
import {
  CreateAnswerDto,
  UpdateAnswerDto,
  UpvoteAnswerDto,
} from './dto/answer.dto';
import { AnswerService } from './answer.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/entity/user.entity';

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
  @UseGuards(JwtGuard)
  create(@Body() newAnswer: CreateAnswerDto, @Req() req: Request) {
    return this.answerService.createAnswer({
      ...newAnswer,
      belongsTo: req.user as User,
    });
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
