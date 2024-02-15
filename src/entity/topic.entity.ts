import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Question } from "./question.entity";
import { Answer } from "./answer.entity";

@Entity("topics")
export class Topic{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:false, unique:true})
    title:string

    @Column({nullable:false})
    description: string

    //We will work into this thingy later to have a path or url or whatever
    @Column()
    picture: string

    @ManyToMany((type)=>User, (user)=>user.topics)
    users: User[]

    @ManyToMany((type)=>Question, (question)=>question.topics)
    questions: Question[]
}