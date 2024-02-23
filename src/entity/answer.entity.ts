import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Question } from "./question.entity";

@Entity("answers")
export class Answer{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:false})
    description: string

    @ManyToMany(type=>User,user=>user.upvotedAnswers)
    @JoinTable()
    upvotedBy: User[]

    @Column({nullable:true})
    downvote: boolean

    @ManyToOne(type=>User, (user)=>user.answers)
    belongsTo: User

    @ManyToOne((type)=>Question, (question)=>question.answers)
    question: Question
}