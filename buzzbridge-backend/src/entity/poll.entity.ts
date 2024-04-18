import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from './option.entity';
import { User } from './user.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @OneToMany(() => Option, (option) => option.poll, {
    onDelete: 'CASCADE',
  })
  options: Option[];

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => User, (user) => user.options, { onDelete: 'CASCADE' })
  belongsTo: User;
}
