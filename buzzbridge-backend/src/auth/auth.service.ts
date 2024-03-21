import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../entity/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private imagekit = new ImageKit({
    publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
    privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
    urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT'),
  });
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(username: string, password: string) {
    try {
      const user = await this.userService.findOneByUsername(username);
      if (
        user &&
        (password === user.password ||
          (await bcrypt.compare(password, user.password)))
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return {
          jwt: this.jwtService.sign({ username: user.username, sub: user.id }),
          data: result,
        };
      } else {
        this.logger.log('Wrong Credentials' + username);
        return null;
      }
    } catch (error) {
      this.logger.error('Error : ' + error);
      throw error;
    }
  }

  async getImageKitUrl(user: User, file: Express.Multer.File) {
    this.logger.log('Getting Imagekit Url');
    try {
      const result = await this.imagekit.upload({
        file: file?.buffer,
        fileName: file.originalname,
        folder: '/buzz-bridge',
      });
      console.log(result);
      return { url: result.url, fileId: result.fileId };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async removeImageByUrl(url: string, fileId: string): Promise<any> {
    this.logger.log('Deleting Image from Imagekit');
    try {
      console.log('File to be deleted', fileId);
      const results = await this.imagekit.deleteFile(fileId);
      return results;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async resetPassword(newPassword: string, token: string) {
    try {
      const { username, password } = this.jwtService.verify(token);
      const verification = this.validateUser(username, password);
      if (!verification) {
        throw new Error('Invalid Token');
      }
      await this.userService.updateUserPassword(username, newPassword);
      return 'Password Reset Successfully';
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async sendEmail(userEmail: string) {
    try {
      this.logger.log('Sending email');
      //generate a jwt signed token with userEmail and send it to the user email
      const token = this.jwtService.sign({ email: userEmail });
      const buttonUrl = `${this.configService.get('BACKEND_URL')}/verify/${token}`;
      await this.mailerService.sendMail({
        from: 'noreply@buzzbridge.com',
        to: userEmail,
        subject: 'Welcome to Buzz Bridge',
        html: `
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
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
                background-color:  rgb(185, 43, 39);
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
                <h2>Signup Successful!</h2>
              </div>
              <div class="message">
                <img src="images/image-5.png" alt="Image" width="58">
                <p>Hello,</p>
                <p>We have sent you this email in response to your request to create your account at BuzzBridge. To proceed further, please click the button below:</p>
                <a href=${buttonUrl} style="background-color: #ffffff; color: #161a39; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
              </div>
              <div class="header">
                <p>Please ignore this email if you did not request a password change.</p>
              </div>
              <div class="footer">
                <p>BuzzBridge &copy; All Rights Reserved</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      this.logger.log(`Email sent to ${userEmail}`);
      return token;
    } catch (error) {
      this.logger.error(error.message);
      return error.message;
    }
  }

  async confirmVerificationEmail(token: string): Promise<string> {
    try {
      const { email } = this.jwtService.verify(token);
      const user = await this.userService.getUserInfo(email);
      await this.userService.registerUser(user);
      this.logger.log('User Verified');
      return this.jwtService.sign(user);
    } catch (error) {
      this.logger.error(error.message);
      return error.message;
    }
  }
}
