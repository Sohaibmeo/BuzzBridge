import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async sendGmail(
    buttonUrl: string,
    userEmail: string,
    forgetPassword: boolean,
  ) {
    try {
      await this.mailerService.sendMail({
        from: 'noreply@buzzbridge.com',
        to: userEmail,
        subject: 'Welcome to Buzz Bridge',
        html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html
              xmlns="http://www.w3.org/1999/xhtml"
              xmlns:v="urn:schemas-microsoft-com:vml"
              xmlns:o="urn:schemas-microsoft-com:office:office"
            >
              <head>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    background-color: #f1f1f1;
                    font-family: 'Lato', sans-serif;
                  }
      
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    text-align: center;
                  }
      
                  .content {
                    background-color: #fff;
                    color: rgb(185, 43, 39);
                    padding: 20px;
                  }
      
                  .header {
                    background-color: #ffffff;
                    padding: 20px;
                  }
      
                  .message {
                    background-color: rgb(185, 43, 39);
                    color: #ffffff;
                    padding: 20px;
                  }
                  .footer {
                    background-color: #000;
                    color: #fff;
                    padding: 20px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="content">
                    <h1>BuzzBridge</h1>
                  </div>
                  <div class="header">
                    <h2>${forgetPassword ? 'Reset your password' : 'Woah You are almost there'}</h2>
                  </div>
                  <div class="message">
                    <p>
                      We have sent you this email in response to your request to
                       ${forgetPassword ? 'Reset your password' : 'create your account'} at BuzzBridge. To proceed further, please click the button
                      below:
                    </p>
                    <a
                      href="${buttonUrl}"
                      style="
                        background-color: #ffffff;
                        color: #161a39;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                      "
                      >${forgetPassword ? 'Change Password' : 'Verify Email'}</a
                    >
                  </div>
                  <div class="header">
                    <p>
                      Please ignore this email if you did not request this change.
                    </p>
                  </div>
                  <div class="footer">
                    <p>BuzzBridge &copy; All Rights Reserved</p>
                  </div>
                </div>
              </body>
            </html>
            `,
      });
    } catch (error) {
      throw error;
    }
  }
  async sendForgetPasswordEmail(userEmail: string) {
    try {
      this.logger.log('Sending email');
      const user = await this.userService.findOneByEmail(userEmail);
      if (!user) {
        throw new Error('User not found');
      }
      const token = this.authService.sign({ email: userEmail });
      const buttonUrl = `${this.configService.get('FRONTEND_URL')}/signup-reset-password/${token}`;
      await this.sendGmail(buttonUrl, userEmail, true);
      this.logger.log(`Email sent to ${userEmail}`);
      return token;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async sendSignUpMail(userEmail: string) {
    try {
      this.logger.log('Sending email');
      const user = await this.userService.getUserInfo(userEmail);
      const token = this.authService.sign(user);
      const buttonUrl = `${this.configService.get('FRONTEND_URL')}/signup/${token}`;
      await this.sendGmail(buttonUrl, userEmail, false);
      this.logger.log(`Email sent to ${userEmail}`);
      return token;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
