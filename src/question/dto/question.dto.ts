import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsInt, IsString } from 'class-validator';
import { Topic } from 'src/entity/topic.entity';
import { User } from 'src/entity/user.entity';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsInt()
  belongsTo: User;

  @IsArray()
  assignedTopics: Topic[];
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
