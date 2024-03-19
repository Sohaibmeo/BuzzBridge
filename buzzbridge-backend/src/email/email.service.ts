import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}
  async sendEmail(userEmail: string) {
    try {
      const tempCreds = await this.userService.registerUser(userEmail);
      await this.mailerService.sendMail({
        from: 'noreply@buzzbridge.com',
        to: userEmail,
        subject: 'Welcome to Buzz Bridge',
        context: {
          username: tempCreds.username,
          password: tempCreds.password,
        },
        template: 'register-user.hbs',
      });
      return { email: userEmail };
    } catch (error) {
      return error.message;
    }
  }

  // async sendEmailWithTemplate(userEmail: string) {
  //   const user = this.userService.findOneByEmail(userEmail);
  //   if (!user) {
  //     return { message: 'User not found' };
  //   }
  //   const resetUrl = 'http://localhost:3000/reset-password';
  //   try {
  //     await this.mailerService.sendMail({
  //       from: 'noreply@buzzbridge.com',
  //       to: userEmail,
  //       subject: 'Forget Password',
  //       context: {
  //         resetUrl: resetUrl,
  //       },
  //       template: 'forget-password.hbs',
  //     });
  //     return { email: userEmail };
  //   } catch (error) {
  //     return error.message;
  //   }
  // }
}
