import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}
  async sendEmail(userEmail: string) {
    try {
      this.logger.log('Sending email');
      const tempCreds = await this.userService.registerUser(userEmail);
      await this.mailerService.sendMail({
        from: 'noreply@buzzbridge.com',
        to: userEmail,
        subject: 'Welcome to Buzz Bridge',
        // context: {
        //   username: tempCreds.username,
        //   password: tempCreds.password,
        // },
        // template: 'register-user.hbs',
        html: `<h1>Welcome to Buzz Bridge</h1><p>Your username is: ${tempCreds.username}</p><p>Your password is: ${tempCreds.password}</p>`,
      });
      this.logger.log(`Email sent to ${userEmail}`);
      return { email: userEmail };
    } catch (error) {
      this.logger.error(error.message);
      this.userService.deleteUserByEmail(userEmail);
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
