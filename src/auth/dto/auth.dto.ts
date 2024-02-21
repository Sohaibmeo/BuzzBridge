import { IsString, IsStrongPassword } from "class-validator";

export class AuthPayloadDto {
    @IsString()
    username: string

    @IsString()
    @IsStrongPassword()
    password: string
}