import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/register-user')
  async sendEmail(@Body('email') email: string) {
    return this.emailService.sendEmail(email);
  }

  // @Post('/forget-password')
  // async sendEmailWithTemplate(@Body('email') email: string) {
  //   return this.emailService.sendEmailWithTemplate(email);
  // }
}
