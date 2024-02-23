import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('question')
export class QuestionController {
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

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.questionService.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() newQuestion: CreateQuestionDto) {
    return this.questionService.createQuestion(newQuestion);
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
