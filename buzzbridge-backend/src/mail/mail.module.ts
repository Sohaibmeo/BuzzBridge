import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: 'SSL',
        auth: {
          user: process.env.GOOGLE_SMTP_EMAIL,
          pass: process.env.GOOGLE_SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"Buzz Bridge" <noreply@buzzbridge.com>',
      },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
