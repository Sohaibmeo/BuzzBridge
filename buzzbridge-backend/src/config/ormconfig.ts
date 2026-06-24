import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Answer } from '../entity/answer.entity';
import { Option } from '../entity/option.entity';
import { Poll } from '../entity/poll.entity';
import { Question } from '../entity/question.entity';
import { Topic } from '../entity/topic.entity';
import { User } from '../entity/user.entity';

export const getConfig = async (
  configService: ConfigService,
): Promise<PostgresConnectionOptions> => ({
  type: 'postgres',
  database: configService.get<string>('DATABASE_NAME'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  host: configService.get<string>('HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 5432,
  entities: [User, Question, Answer, Topic, Option, Poll],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  logging: ['error', 'migration'],
});

export const getConfigProdWithUrl = async (
  configService: ConfigService,
): Promise<PostgresConnectionOptions> => ({
  type: 'postgres',
  url: configService.get<string>('POSTGRES_URL'),
  entities: [User, Question, Answer, Topic, Option, Poll],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  logging: ['error', 'migration'],
});
