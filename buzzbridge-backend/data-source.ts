import { DataSource } from 'typeorm';
import { User } from './src/entity/user.entity';
import { Question } from './src/entity/question.entity';
import { Answer } from './src/entity/answer.entity';
import { Topic } from './src/entity/topic.entity';
import { Option } from './src/entity/option.entity';
import { Poll } from './src/entity/poll.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'buzz-bridge',
  entities: [User, Question, Answer, Topic, Option, Poll],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: ['error', 'migration'],
});
