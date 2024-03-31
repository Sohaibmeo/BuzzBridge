import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';
import { AnswerService } from './answer.service';
import { JwtGuard } from '../guards/jwt.guard';
import { Request } from 'express';
import { User } from '../entity/user.entity';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.answerService.findOne(id);
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
      return await this.answerService.findAllByUserId(
        { id: userId } as User,
        page,
        limit,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Get('question/:questionId')
  async findAllByQuestionId(
    @Param('questionId') questionId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.answerService.findAllByQuestionId(
        questionId,
        page,
        limit,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':answerId/upvote')
  @UseGuards(JwtGuard)
  async upvote(@Param('answerId') answerId: number, @Req() request: Request) {
    try {
      return await this.answerService.addUpvote(answerId, request.user as User);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post(':answerId/removeupvote')
  @UseGuards(JwtGuard)
  async removeUpvote(
    @Param('answerId') answerId: number,
    @Req() request: Request,
  ) {
    try {
      return await this.answerService.removeUpvote(
        answerId,
        request.user as User,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':answerId/downvote')
  @UseGuards(JwtGuard)
  async downvote(@Param('answerId') answerId: number, @Req() request: Request) {
    try {
      return await this.answerService.addDownvote(
        answerId,
        request.user as User,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':answerId/removedownvote')
  @UseGuards(JwtGuard)
  async removeDownvote(
    @Param('answerId') answerId: number,
    @Req() request: Request,
  ) {
    try {
      return await this.answerService.removeDownvote(
        answerId,
        request.user as User,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() newAnswer: CreateAnswerDto, @Req() req: Request) {
    try {
      return await this.answerService.createAnswer({
        ...newAnswer,
        belongsTo: req.user as User,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  async updateAnswer(
    @Param('id') id: number,
    @Body() updatedAnswer: UpdateAnswerDto,
  ) {
    try {
      return await this.answerService.updateAnswer(id, updatedAnswer);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async removeAnswer(@Param('id') id: number) {
    try {
      return await this.answerService.deleteAnswer(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
