import {
  Controller,
  Delete,
  Get,
  Logger,
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

  // @UseGuards(LocalGuard)
  // @Post('login')
  // loginUser(@Req() req: any, @Res({ passthrough: true }) response: Response) {
  //   response.cookie('jwt', req.user?.jwt, {
  //     sameSite: 'none',
  //     secure: true,
  //     httpOnly: true,
  //   });
  //   response.send(req.user?.data);
  // }

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
    const imagekitAuthToken = this.authService.getImageKitUrl(
      request.user as User,
      file,
    );
    return imagekitAuthToken;
  }

  @Delete('/imagekit')
  @UseGuards(JwtGuard)
  deleteImage(@Query('url') url: string, @Query('fileId') fileId: string) {
    return this.authService.removeImageByUrl(url, fileId);
  }
}
