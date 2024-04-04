import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Poll } from './poll.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => Poll, (poll) => poll.options, {
    onDelete: 'CASCADE',
  })
  poll: Poll;

  @ManyToOne(() => User, (user) => user.options)
  belongsTo: User;

  @ManyToMany(() => User, (user) => user.selectedOptions)
  @JoinTable()
  votedBy: User[];
}
