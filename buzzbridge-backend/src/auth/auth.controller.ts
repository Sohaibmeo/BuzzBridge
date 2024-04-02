import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../entity/user.entity';
import { UpdateUserPasswordDto } from '../user/dto/userDto';
import { GoogleGuard } from 'src/guards/google.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  async googleLogin() {
    try {
      const googleAuthUrl = this.authService.generateGoogleAuthUrl();
      return { url: googleAuthUrl };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleLoginCallback(@Req() req: any) {
    try {
      this.logger.log('Google Login Callback...');
      return await this.authService.googleLogin(req.user);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    try {
      this.logger.log('Verifying Email...');
      return await this.authService.confirmVerificationEmail(token);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  @Post('reset-password-link/:token')
  async resetPasswordWithLink(
    @Body('password') password: string,
    @Param('token') token: string,
  ) {
    try {
      return await this.authService.resetPassword(password, token);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/account-password-change')
  @UseGuards(JwtGuard)
  async updatePassword(
    @Req() request: Request,
    @Body() Data: UpdateUserPasswordDto,
  ) {
    try {
      const { password, newPassword } = Data;
      if (!password || !newPassword) {
        throw new HttpException(
          'Password and new password are required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.authService.resetPasswordWithOldPassword(
        request.user as User,
        password,
        newPassword,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body('password') password: string,
    @Param('token') token: string,
  ) {
    try {
      return await this.authService.resetPasswordWithOldPasswordInToken(
        password,
        token,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@Req() req: any) {
    try {
      return req.user;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
