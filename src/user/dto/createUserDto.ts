import { IsNumber, IsString } from "class-validator"

export class createUserDto{
     @IsString()
     name:string

     @IsNumber()
     age:number

     @IsString()
     gender:string

     @IsString()
     email:string

     @IsString()
     username:string

     @IsString()
     picture:string
}