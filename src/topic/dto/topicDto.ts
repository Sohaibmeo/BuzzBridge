import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/entity/user.entity";

export class CreateTopicDto {
    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()
    picture: string

    @IsOptional()
    createdBy: User
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}