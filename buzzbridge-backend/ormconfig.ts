import { ConfigService } from '@nestjs/config'
import { Question } from './src/entity/question.entity';
import { Answer } from './src/entity/answer.entity';
import { Topic } from './src/entity/topic.entity';
import { User } from './src/entity/user.entity';
import { Option } from './src/entity/option.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Poll } from './src/entity/poll.entity';

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
  synchronize: false, // Disabled for production safety
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true, // Auto-run migrations on app start
  logging: ['error', 'migration'],
});

export const getConfigProdWithUrl = async (
  configService: ConfigService,
): Promise<PostgresConnectionOptions> => ({
  type: 'postgres',
  url: configService.get<string>('POSTGRES_URL'),
  entities: [User, Question, Answer, Topic, Option, Poll],
  synchronize: false, // Never use synchronize in production
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true, // Auto-run migrations on app start
  logging: ['error', 'migration'],
});
