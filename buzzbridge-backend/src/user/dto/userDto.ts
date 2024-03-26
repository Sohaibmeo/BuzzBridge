import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;
}
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  fileId?: string;
  @IsString()
  picture?: string;
  @IsString()
  about?: string;

  @IsNumber()
  age?: number;
  @IsString()
  gender?: string;

}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserPasswordDto {
  @IsString()
  password: string;
  @IsString()
  newPassword: string;
}
