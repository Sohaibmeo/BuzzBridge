import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Topic } from '../../entity/topic.entity';
import { User } from '../../entity/user.entity';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  picture: string;

  @IsOptional()
  @IsString()
  fileId: string;

  @IsOptional()
  @IsInt()
  belongsTo: User;

  @IsArray()
  assignedTopics: Topic[];

  @IsOptional()
  @IsInt()
  score: number;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
