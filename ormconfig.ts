import { ConfigService } from '@nestjs/config';
import { Answer } from 'src/entity/answer.entity';
import { Question } from 'src/entity/question.entity';
import { Topic } from 'src/entity/topic.entity';
import { User } from 'src/entity/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const getConfig = async (configService: ConfigService): Promise<PostgresConnectionOptions> => ({
  type: 'postgres',
  database: configService.get<string>('DATABASE_NAME'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  host: configService.get<string>('HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 5432,
  entities: [User, Question, Answer, Topic],
  synchronize: true,
});

export default getConfig;
