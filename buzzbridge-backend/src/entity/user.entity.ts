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
import { Option } from './option.entity';
import { Poll } from './poll.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  fileId: string;

  @Column({ nullable: true })
  about: string;

  @OneToMany(() => Topic, (topic) => topic.belongsTo)
  createdTopics: Topic[];

  @ManyToMany(() => Answer, (answer) => answer.upvotedBy)
  upvotedAnswers: Answer[];

  @ManyToMany(() => Answer, (answer) => answer.downvotedBy)
  downvotedAnswers: Answer[];

  @ManyToMany(() => Topic, (topic) => topic.followers)
  @JoinTable()
  topics: Topic[];

  @ManyToMany(() => Question, (question) => question.upvotedBy)
  upvotedQuestions: Question[];

  @ManyToMany(() => Question, (question) => question.downvotedBy)
  downvotedQuestions: Question[];

  @ManyToMany(() => Option, (option) => option.votedBy)
  selectedOptions: Option[];

  @OneToMany(() => Question, (question) => question.belongsTo)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.belongsTo)
  answers: Answer[];

  @OneToMany(() => Option, (option) => option.belongsTo)
  options: Option[];

  @OneToMany(() => Poll, (poll) => poll.belongsTo)
  polls: Poll[];
}
