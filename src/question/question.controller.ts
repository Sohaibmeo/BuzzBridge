import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/entity/user.entity';

@Controller('question')
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);
  constructor(private readonly questionService: QuestionService) {}

  @Get(':questionId/upvote')
  getUpvoteCount(@Param('questionId') questionId: number) {
    return this.questionService.getUpvoteCount(questionId);
  }

  @Post(':questionId/upvote')
  upvote(
    @Param('questionId') questionId: number,
    @Body() data: { userId: number },
  ) {
    return this.questionService.addUpvote(questionId, data.userId);
  }

  @Post(':questionId/downvote')
  downvote(
    @Param('questionId') questionId: number,
    @Body() data: { userId: number },
  ) {
    return this.questionService.removeUpvote(questionId, data.userId);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get('/answered')
  @UseGuards(JwtGuard)
  findAllByTheUser(@Req() request: Request) {
    return this.questionService.findAllFromUser(
      (request.user as User) || ({ id: 85 } as User),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.questionService.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() newQuestion: CreateQuestionDto, @Req() request: Request) {
    return this.questionService.createQuestion({
      ...newQuestion,
      belongsTo: request.user as User,
    });
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatedQuestion: UpdateQuestionDto) {
    return this.questionService.updateQuestion(id, updatedQuestion);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.questionService.deleteQuestion(id);
  }
}
