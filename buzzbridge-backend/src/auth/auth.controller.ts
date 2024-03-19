import {
  Controller,
  Delete,
  Get,
  // FileTypeValidator,
  Logger,
  // MaxFileSizeValidator,
  // ParseFilePipe,
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

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    response.cookie('jwt', req.user?.jwt, {
      sameSite: true,
      secure: true,
      httpOnly: true,
    });
    response.send(req.user?.data);
  }

  @Get('status')
  @UseGuards(JwtGuard)
  status() {
    return 'good';
  }
  //TODO: make sure to include some other validators for file size and file type etc
  // new ParseFilePipe({
  //   validators: [
  //     new MaxFileSizeValidator({ maxSize: 1000 }),
  //     new FileTypeValidator({ fileType: 'image/*' }),
  //   ],
  // }),
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
