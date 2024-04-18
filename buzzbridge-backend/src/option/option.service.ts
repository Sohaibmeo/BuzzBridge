import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from '../entity/option.entity';
import { Repository } from 'typeorm';
import { CreateOptionDto } from './dto/option.dto';

@Injectable()
export class OptionService {
  private readonly logger = new Logger(OptionService.name);
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  async createOption(body: CreateOptionDto) {
    await this.optionRepository
      .createQueryBuilder()
      .insert()
      .into(Option)
      .values(body)
      .execute();
    return body;
  }

  deleteOption(id: number) {
    this.optionRepository
      .createQueryBuilder()
      .delete()
      .where({ id: id })
      .execute();
    return;
  }
}
