import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig, getConfigProdWithUrl } from '../ormconfig';
import { UserModule } from './user/user.module';
import { TopicModule } from './topic/topic.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const env = process.env.NODE_ENV || 'production';
console.log('env', env);
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: env === 'production' ? getConfigProdWithUrl : getConfig,
      inject: [ConfigService],
    }),
    UserModule,
    TopicModule,
    AnswerModule,
    QuestionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
