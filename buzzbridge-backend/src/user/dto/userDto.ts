import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

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
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserPasswordDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  newPassword: string;
}
