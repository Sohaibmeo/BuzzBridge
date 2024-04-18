import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Option } from 'src/entity/option.entity';
import { User } from 'src/entity/user.entity';

export class RequestCreatePollDto {
  @IsString()
  @MinLength(5)
  @MaxLength(300)
  title: string;

  @IsNotEmpty()
  @IsArray()
  options: Option[];

  @IsOptional()
  belongsTo?: User;
}

export class CreatePollDto extends RequestCreatePollDto {}

export class UpdatePollDto extends PartialType(CreatePollDto) {}
