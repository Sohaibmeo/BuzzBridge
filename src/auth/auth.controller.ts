import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService:AuthService){}

    @Post('login')
    loginUser(@Body() auth:AuthPayloadDto){
        return this.authService.login(auth.username,auth.password) 
    }

    @Get()
    statusUser(@Body() auth:AuthPayloadDto){

    }
}
