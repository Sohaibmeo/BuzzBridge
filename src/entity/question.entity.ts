import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Topic } from './topic.entity';
import { Answer } from './answer.entity';
import { IsOptional } from 'class-validator';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @IsOptional()
  @Column({ nullable: true })
  picture: string;

  @ManyToMany(() => User, (user) => user.upvotedQuestions)
  @JoinTable()
  upvotedBy: User[];

  @Column({ nullable: true })
  downvote: boolean;

  @ManyToOne(() => User, (user) => user.questions)
  belongsTo: User;

  @ManyToMany(() => Topic, (topic) => topic.questions)
  @JoinTable()
  assignedTopics: Topic[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
