import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  picture: string;

  @IsOptional()
  @IsString()
  about: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
