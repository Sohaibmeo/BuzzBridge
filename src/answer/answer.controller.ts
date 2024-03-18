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
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';
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
  @Get('user/:userId')
  findAllByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.answerService.findAllByUserId(
      { id: userId } as User,
      page,
      limit,
    );
  }
  @Get('question/:questionId')
  findAllByQuestionId(
    @Param('questionId') questionId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.answerService.findAllByQuestionId(questionId, page, limit);
  }

  @Post(':answerId/upvote')
  @UseGuards(JwtGuard)
  upvote(@Param('answerId') answerId: number, @Req() request: Request) {
    return this.answerService.addUpvote(answerId, request.user as User);
  }
  @Post(':answerId/removeupvote')
  @UseGuards(JwtGuard)
  removeUpvote(@Param('answerId') answerId: number, @Req() request: Request) {
    return this.answerService.removeUpvote(answerId, request.user as User);
  }

  @Post(':answerId/downvote')
  @UseGuards(JwtGuard)
  downvote(@Param('answerId') answerId: number, @Req() request: Request) {
    return this.answerService.addDownvote(answerId, request.user as User);
  }

  @Post(':answerId/removedownvote')
  @UseGuards(JwtGuard)
  removeDownvote(@Param('answerId') answerId: number, @Req() request: Request) {
    return this.answerService.removeDownvote(answerId, request.user as User);
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
