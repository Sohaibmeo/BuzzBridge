import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('GOOGLE_SMTP_EMAIL');
        const pass = configService.get<string>('GOOGLE_SMTP_PASSWORD');
        const emailDeliveryEnabled =
          configService.get<string>('EMAIL_DELIVERY_ENABLED') === 'true';

        return {
          transport:
            emailDeliveryEnabled && user && pass
              ? {
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: { user, pass },
                }
              : {
                  host: '127.0.0.1',
                  port: 2525,
                  secure: false,
                  ignoreTLS: true,
                },
          defaults: {
            from: '"Buzz Bridge" <noreply@buzzbridge.com>',
          },
        };
      },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
