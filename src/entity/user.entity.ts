import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from "bcrypt";


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


    //I want to build an insert function that automatically
    // encrypts the function

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password,10)
    }
}