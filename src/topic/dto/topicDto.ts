import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/entity/user.entity';

export class CreateTopicDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  picture: string;

  @IsOptional()
  createdBy: User;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
