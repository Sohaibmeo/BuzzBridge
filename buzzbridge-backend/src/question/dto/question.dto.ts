import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Topic } from '../../entity/topic.entity';
import { User } from '../../entity/user.entity';

export class CreateQuestionDto {
  @IsString()
  @Length(2, 100, {
    message: 'Title must be between 2 and 100 characters long',
  })
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

  @IsArray({ message: 'Assigned topics must be an array' })
  @IsInt({ each: true })
  @ArrayNotEmpty({ message: 'Question must belong to atleast 1 topic' })
  assignedTopics: Topic[];

  @IsOptional()
  @IsInt()
  score: number;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
