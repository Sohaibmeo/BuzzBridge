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
import { PollService } from './poll.service';
import { RequestCreatePollDto, UpdatePollDto } from './dto/poll.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from 'src/entity/user.entity';
import { Request } from 'express';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}
  @Get()
  getPoll() {
    return this.pollService.getAllPolls();
  }

  @Get(':id')
  getPollById(@Param('id') id: number) {
    return this.pollService.getPollById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  createPoll(@Req() req: Request, @Body() body: RequestCreatePollDto) {
    try {
      return this.pollService.createPoll(body, req.user as User);
    } catch (error) {
      return error.detail;
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updatePollById(@Param('id') id: number, @Body() body: UpdatePollDto) {
    try {
      return this.pollService.updatePollById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  deletePollById(@Param('id') id: number) {
    return this.pollService.deletePoll(id);
  }
}
