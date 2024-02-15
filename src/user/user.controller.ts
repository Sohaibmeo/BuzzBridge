import { Body, Controller, Get, Post } from '@nestjs/common';
import { createUserDto } from './dto/createUserDto';

@Controller('user')
export class UserController {
    @Get()
    test(){
        return 'this should be displayed'
    }

    @Post()
    checkThisOut( @Body() createUserDto:createUserDto ){
        return createUserDto
    }
}
