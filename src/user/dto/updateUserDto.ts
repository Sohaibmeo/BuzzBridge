import { CreateUserDto } from "./createUserDto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateUserDto extends PartialType(CreateUserDto){}