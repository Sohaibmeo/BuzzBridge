import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from 'src/guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService:AuthService){}

    @UseGuards(LocalGuard)
    @Post('login')
    loginUser(@Req() req:Request){
        return req.user
    }

    @Get()
    @UseGuards(JwtGuard)
    statusUser(@Req() request:Request){
        return request.user
    }
}
