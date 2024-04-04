import { Module } from '@nestjs/common';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from '../entity/poll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll])],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
