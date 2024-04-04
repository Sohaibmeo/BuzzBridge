import { Module } from '@nestjs/common';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../entity/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
