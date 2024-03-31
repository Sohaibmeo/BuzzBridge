import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNumber,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
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
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`\\\-|=])/, {
    message:
      'Password must contain at least one number, uppercase letter, and a special character',
  })
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
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`\\\-|=])/, {
    message:
      'Password must contain at least one number, uppercase letter, and a special character',
  })
  newPassword: string;
}
