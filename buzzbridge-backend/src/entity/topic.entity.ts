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

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  fileId: string;

  @Column({ default: 0 })
  followCount: number;

  @ManyToOne(() => User, (user) => user.createdTopics)
  belongsTo: User;

  @ManyToMany(() => User, (user) => user.topics, {
    onDelete: 'CASCADE',
  })
  followers: User[];

  @ManyToMany(() => Question, (question) => question.assignedTopics, {
    onDelete: 'CASCADE',
  })
  questions: Question[];
}
