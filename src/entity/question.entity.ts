import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Topic } from "./topic.entity";
import { Answer } from "./answer.entity";

@Entity("questions")
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:false})
    description: string

    @Column()
    like: number

    @Column()
    dislike: number

    @ManyToOne(type=>User, (user)=>user.questions)
    user: User

    @ManyToMany((type)=>Topic, (topic)=>topic.questions)
    @JoinTable()
    topics:Topic[]

    @OneToMany((type)=>Answer, (answer)=>answer.question)
    answers: Answer[]
}