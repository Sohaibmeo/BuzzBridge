import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createUserDto } from './dto/createUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService) {}

    @Get(':id')
    test(@Param('id') id: string){
        return this.userService.findOne(id)
    }

    @Post()
    checkThisOut( @Body() createUserDto:createUserDto ){
        return this.userService.createUser(createUserDto)
    }


}
