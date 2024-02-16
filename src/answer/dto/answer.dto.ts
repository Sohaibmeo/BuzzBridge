import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";
import { Question } from "src/entity/question.entity";
import { User } from "src/entity/user.entity";

export class CreateAnswerDto {
    // @IsInt()
    // question: Question

    @IsInt()
    belongsTo: User

    @IsString()
    description: string

    // @IsBoolean()
    // @IsOptional()
    // downvote?:boolean
}

export class UpdateAnswerDto extends PartialType(CreateAnswerDto){}

export class UpvoteAnswerDto {
    @IsInt()
    upvotedBy: number
}