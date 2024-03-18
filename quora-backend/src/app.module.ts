import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import getConfig from '../ormconfig';
import { UserModule } from './user/user.module';
import { TopicModule } from './topic/topic.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getConfig,
      inject: [ConfigService],
    }),
    UserModule,
    TopicModule,
    AnswerModule,
    QuestionModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
