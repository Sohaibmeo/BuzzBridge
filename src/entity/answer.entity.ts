import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Question } from "./question.entity";

@Entity("answers")
export class Answer{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:false})
    description: string

    @Column()
    likes: number

    @Column()
    dislikes:number

    @ManyToOne(type=>User, (user)=>user.answers)
    user: User

    @ManyToOne((type)=>Question, (question)=>question.answers)
    question: Question
}