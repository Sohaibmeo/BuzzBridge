import { Injectable, Logger } from '@nestjs/common';
import { CreatePollDto, UpdatePollDto } from './dto/poll.dto';
import { Repository } from 'typeorm';
import { Poll } from '../entity/poll.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Option } from '../entity/option.entity';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  constructor(
    @InjectRepository(Poll) private readonly pollRepository: Repository<Poll>,
  ) {}

  getAllPolls() {
    return this.pollRepository.find({
      relations: ['options', 'belongsTo', 'options.belongsTo'],
    });
  }

  getPollById(id: number) {
    return this.pollRepository.findOne({
      where: { id: id },
      relations: ['options', 'belongsTo', 'options.belongsTo'],
    });
  }

  async createPoll(body: CreatePollDto, user: User) {
    const { options } = body;
    const pollBody = {
      ...body,
      belongsTo: user,
    };
    const poll = await this.pollRepository
      .createQueryBuilder()
      .insert()
      .into(Poll)
      .values(pollBody)
      .execute();
    const optionsToInsert = options.map((option) => ({
      ...option,
      belongsTo: user,
      poll: poll.identifiers[0].id,
    }));
    this.pollRepository
      .createQueryBuilder()
      .insert()
      .into(Option)
      .values(optionsToInsert)
      .execute();
    return pollBody;
  }

  async updatePollById(id: number, body: UpdatePollDto) {
    await this.pollRepository
      .createQueryBuilder()
      .update(Poll)
      .set(body)
      .where('id = :id', { id })
      .execute();
    return;
  }

  async deletePoll(id: number) {
    await this.pollRepository
      .createQueryBuilder()
      .delete()
      .from(Poll)
      .where('id = :id', { id })
      .execute();
  }
}
