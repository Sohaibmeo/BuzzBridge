import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => User, (user) => user.createdTopics)
  belongsTo: User;

  @ManyToMany(() => User, (user) => user.topics)
  followers: User[];

  @ManyToMany(() => Question, (question) => question.assignedTopics)
  questions: Question[];
}
