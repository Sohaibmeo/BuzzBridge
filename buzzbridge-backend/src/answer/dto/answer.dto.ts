import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Question } from '../../entity/question.entity';
import { User } from '../../entity/user.entity';

export class CreateAnswerDto {
  @IsInt()
  question: Question;

  @IsInt()
  @IsOptional()
  belongsTo: User;

  @IsString()
  description: string;

  @IsOptional()
  upvotedBy: User[];
}

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {}

export class UpvoteAnswerDto {
  @IsInt()
  upvotedBy: number;
}
