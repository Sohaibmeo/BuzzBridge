import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateTopicDto {
    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()
    picture: string
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}