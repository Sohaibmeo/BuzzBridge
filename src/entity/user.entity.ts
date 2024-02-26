import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  about: string;

  @OneToMany(() => Topic, (topic) => topic.belongsTo)
  createdTopics: Topic[];

  @ManyToMany(() => Answer, (answer) => answer.upvotedBy)
  upvotedAnswers: Answer[];

  @ManyToMany(() => Topic, (topic) => topic.followers)
  @JoinTable()
  topics: Topic[];

  @ManyToMany(() => Question, (question) => question.upvotedBy)
  upvotedQuestions: Question[];

  @ManyToMany(() => Question, (question) => question.downvotedBy)
  downvotedQuestions: Question[];

  @OneToMany(() => Question, (question) => question.belongsTo)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.belongsTo)
  answers: Answer[];
}
