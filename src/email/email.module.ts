import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
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
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
