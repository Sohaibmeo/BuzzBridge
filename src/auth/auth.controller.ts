import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/entity/user.entity';

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

  @Get('/imagekit/generate-auth-token')
  @UseGuards(JwtGuard)
  authImageKitToken() {
    const imagekitAuthToken = this.authService.getImagekitAuth();
    return imagekitAuthToken;
  }

  @Get('/imagekit/image-url/:fileName')
  generateAuthKitUrl(@Req() req: Request, @Param('fileName') fileName: string) {
    const imagekitAuthToken = this.authService.getImageKitUrl(
      req.user as User,
      fileName,
    );
    return imagekitAuthToken;
  }
}
