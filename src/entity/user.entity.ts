import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Topic } from "./topic.entity";
import { Question } from "./question.entity";
import { Answer } from "./answer.entity";


@Entity("users")
export class User{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable: false})
    password: string

    @Column({ nullable: false })
    name:string

    @Column()
    age:number

    @Column()
    gender:string

    @Column({ nullable: false, unique: true })
    email:string

    @Column({ nullable: false, unique: true })
    username:string

    @Column()
    picture:string

    @OneToMany((type)=>Topic, (topic) => topic.createdBy)
    createdTopics: Topic[]

    @ManyToMany((type)=>Answer, (answer) => answer.upvotedBy)
    upvotedAnswers: Answer[]

    @ManyToMany((type)=>Topic, (topic) => topic.followers)
    @JoinTable()
    topics: Topic[]

    @OneToMany((type)=>Question, (question) => question.user)
    questions: Question[]

    @OneToMany((type)=>Answer, (answer) => answer.belongsTo)
    answers: Answer[]

    //I want to build an insert function that automatically
    // encrypts the function
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password,10)
    }
}