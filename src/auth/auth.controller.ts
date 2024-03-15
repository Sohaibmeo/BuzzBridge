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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('status')
  @UseGuards(JwtGuard)
  status(@Req() req: Request) {
    return req.user;
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
  deleteImage(@Query('url') url: string, @Query('url') fileId: string) {
    return this.authService.removeImageByUrl(url, fileId);
  }
}
