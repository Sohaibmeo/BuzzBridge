import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { Request, Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async sendEmail(@Body('email') email: string) {
    return this.authService.sendEmail(email);
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      this.logger.log('Verifying Email');
      const jwt = await this.authService.confirmVerificationEmail(token);
      this.logger.log('Redirecting to Signup');
      const redirectUrl = `http://localhost:3001/signup/${jwt}`;
      return res.status(302).redirect(redirectUrl);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid Token' });
    }
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body('email') password: string,
    @Param('token') token: string,
  ) {
    return this.authService.resetPassword(password, token);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@Req() req: any) {
    return req.user;
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
