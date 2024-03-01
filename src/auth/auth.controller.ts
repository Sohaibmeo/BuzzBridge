import { Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@Req() req: Request) {
    this.logger.log('Authenticated Request');
    return req.user;
  }

  @Get()
  @UseGuards(JwtGuard)
  statusUser(@Req() request: Request) {
    return request.user;
  }
}
