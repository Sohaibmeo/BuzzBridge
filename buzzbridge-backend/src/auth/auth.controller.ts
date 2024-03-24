import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUpAndSendEmail(@Body('email') email: string) {
    try {
      return this.authService.sendSignUpMail(email);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
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

  @Post('forget-password-link')
  async forgetPassword(@Body('email') email: string) {
    try {
      return this.authService.sendForgetPasswordEmail(email);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body('password') password: string,
    @Param('token') token: string,
  ) {
    try {
      return await this.authService.resetPasswordWithOldPassword(
        password,
        token,
      );
    } catch (error) {
      console.log(error);
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

  @Get('status')
  @UseGuards(JwtGuard)
  status() {
    return 'good';
  }

  @Post('/imagekit/getImageUrl')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.authService.getImageKitUrl(request.user as User, file);
  }

  @Delete('/imagekit')
  @UseGuards(JwtGuard)
  deleteImage(@Query('url') url: string, @Query('fileId') fileId: string) {
    return this.authService.removeImageByUrl(url, fileId);
  }
}
