import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  description: string;

  @ManyToMany(() => User, (user) => user.upvotedAnswers)
  @JoinTable()
  upvotedBy: User[];

  @ManyToMany(() => User, (user) => user.downvotedAnswers)
  @JoinTable()
  downvotedBy: User[];

  @ManyToOne(() => User, (user) => user.answers)
  belongsTo: User;

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: Question;

  calculateScore() {
    const upvotes = this.upvotedBy ? this.upvotedBy.length : 0;
    const downvotes = this.downvotedBy ? this.downvotedBy.length : 0;
    this.score = upvotes - downvotes;
  }
}
