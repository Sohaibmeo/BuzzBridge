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
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { JwtGuard } from '../guards/jwt.guard';
import { Request } from 'express';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';

@Controller('question')
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {}

  @Post(':questionId/upvote')
  @UseGuards(JwtGuard)
  async upvote(
    @Param('questionId') questionId: number,
    @Req() request: Request,
  ) {
    try {
      return await this.questionService.addUpvote(
        questionId,
        request.user as User,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post(':questionId/removeupvote')
  @UseGuards(JwtGuard)
  async removeUpvote(
    @Param('questionId') questionId: number,
    @Req() request: Request,
  ) {
    try {
      return await this.questionService.removeUpvote(
        questionId,
        request.user as User,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':questionId/downvote')
  @UseGuards(JwtGuard)
  async downvote(
    @Param('questionId') questionId: number,
    @Req() request: Request,
  ) {
    try {
      return await this.questionService.addDownvote(
        questionId,
        request.user as User,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':questionId/removedownvote')
  @UseGuards(JwtGuard)
  async removeDownvote(
    @Param('questionId') questionId: number,
    @Req() request: Request,
  ) {
    try {
      return await this.questionService.removeDownvote(
        questionId,
        request.user as User,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      return await this.questionService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/popular')
  async findAllPopular(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.questionService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/latest')
  async findAllLatest(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.questionService.findAllLatest(page, limit);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/following')
  @UseGuards(JwtGuard)
  async findAllFollowing(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: Request,
  ) {
    try {
      const { topics } = await this.userService.findAndGetTopics(
        request.user as User,
      );
      return this.questionService.findFollowedContent(page, limit, topics);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('topic/:topicId')
  async findAllByTopicId(
    @Param('topicId') topicId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.questionService.findAllByTopicId(topicId, page, limit);
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
      return await this.questionService.findAllByUserId(
        { id: userId } as User,
        page,
        limit,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.questionService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() newQuestion: CreateQuestionDto,
    @Req() request: Request,
  ) {
    try {
      return await this.questionService.createQuestion({
        ...newQuestion,
        belongsTo: request.user as User,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedQuestion: UpdateQuestionDto,
  ) {
    try {
      return await this.questionService.updateQuestion(id, updatedQuestion);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.questionService.deleteQuestion(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
