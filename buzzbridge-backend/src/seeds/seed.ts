import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Question } from '../entity/question.entity';
import { Answer } from '../entity/answer.entity';
import { Topic } from '../entity/topic.entity';
import { Option } from '../entity/option.entity';
import { Poll } from '../entity/poll.entity';

dotenv.config();

const testUser = {
  email: 'sohaibmayo12@gmail.com',
  password: 'Test@123',
  username: 'sohaibmayo12',
  name: 'Sohaib Mayo',
};

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'buzz-bridge',
  entities: [User, Question, Answer, Topic, Option, Poll],
  synchronize: true,
  logging: ['error'],
});

async function seed() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const password = await bcrypt.hash(testUser.password, 10);

  const existingUser = await userRepository.findOne({
    where: [{ email: testUser.email }, { username: testUser.username }],
  });

  if (existingUser) {
    await userRepository.update(existingUser.id, {
      email: testUser.email,
      username: testUser.username,
      name: testUser.name,
      password,
    });
    console.log(`Updated test user: ${testUser.email}`);
  } else {
    await userRepository.save({
      email: testUser.email,
      username: testUser.username,
      name: testUser.name,
      password,
    });
    console.log(`Created test user: ${testUser.email}`);
  }

  await dataSource.destroy();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
