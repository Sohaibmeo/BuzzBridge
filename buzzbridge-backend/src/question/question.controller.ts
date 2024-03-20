import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { JwtGuard } from '../guards/jwt.guard';
import { Request } from 'express';
import { User } from '../entity/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('question')
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {}

  @Post(':questionId/upvote')
  @UseGuards(JwtGuard)
  upvote(@Param('questionId') questionId: number, @Req() request: Request) {
    return this.questionService.addUpvote(questionId, request.user as User);
  }
  @Post(':questionId/removeupvote')
  @UseGuards(JwtGuard)
  removeUpvote(
    @Param('questionId') questionId: number,
    @Req() request: Request,
  ) {
    return this.questionService.removeUpvote(questionId, request.user as User);
  }

  @Post(':questionId/downvote')
  @UseGuards(JwtGuard)
  downvote(@Param('questionId') questionId: number, @Req() request: Request) {
    return this.questionService.addDownvote(questionId, request.user as User);
  }

  @Post(':questionId/removedownvote')
  @UseGuards(JwtGuard)
  removeDownvote(
    @Param('questionId') questionId: number,
    @Req() request: Request,
  ) {
    return this.questionService.removeDownvote(
      questionId,
      request.user as User,
    );
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.questionService.findAll(page, limit);
  }

  @Get('/popular')
  findAllPopular(@Query('page') page: number, @Query('limit') limit: number) {
    return this.questionService.findAll(page, limit);
  }

  @Get('/latest')
  findAllLatest(@Query('page') page: number, @Query('limit') limit: number) {
    return this.questionService.findAllLatest(page, limit);
  }

  @Get('/following')
  @UseGuards(JwtGuard)
  async findAllFollowing(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: Request,
  ) {
    const { topics } = await this.userService.findAndGetTopics(
      (request.user as User).id,
    );
    return this.questionService.findFollowedContent(page, limit, topics);
  }

  @Get('topic/:topicId')
  findAllByTopicId(
    @Param('topicId') topicId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.questionService.findAllByTopicId(topicId, page, limit);
  }

  @Get('user/:userId')
  findAllByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.questionService.findAllByUserId(
      { id: userId } as User,
      page,
      limit,
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
