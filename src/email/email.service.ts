import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}
  async sendEmail(userEmail: string) {
    try {
      // const tempCreds = await this.userService.registerUser(userEmail);
      const tempCreds = {
        username: userEmail.split('@')[0],
        password: 'password',
      };
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Welcome to Buzz Bridge',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Buzz Bridge</title>
        </head>
        <body>
            <h1>Welcome to BuzzBridge</h1>
            <p>Hello ${tempCreds.username},</p>
            <p>Your account has been successfully created. Here are your temporary credentials:</p>
            <ul>
                <li><strong>Username:</strong> ${tempCreds.username}</li>
                <li><strong>Password:</strong> ${tempCreds.password}</li>
            </ul>
            <p>Please log in using these credentials and change your password immediately.</p>
            <p>Thank you for joining us!</p>
        </body>
        </html>`,
      });
      return { email: userEmail };
    } catch (error) {
      return error.message;
    }
  }
}
