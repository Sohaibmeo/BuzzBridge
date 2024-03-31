import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { User } from '../../entity/user.entity';

export class CreateTopicDto {
  @IsString()
  @Length(1, 100, {
    message: 'Title must be between 1 and 30 characters long',
  })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(350, {
    message: 'Description must be less than 350 characters long',
  })
  description: string;

  @IsOptional()
  @IsString()
  picture: string;

  @IsOptional()
  @IsString()
  fileId: string;

  @IsOptional()
  belongsTo: User;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
