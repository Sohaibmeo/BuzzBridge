import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('/signup')
  async signUpAndSendEmail(@Body('email') email: string) {
    try {
      return this.mailService.sendSignUpMail(email);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('forget-password-link')
  async forgetPassword(@Body('email') email: string) {
    try {
      return await this.mailService.sendForgetPasswordEmail(email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
