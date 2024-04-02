import {
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { User } from '../entity/user.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/imagekit/getImageUrl')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.imageService.getImageKitUrl(request.user as User, file);
  }

  @Delete('/imagekit')
  @UseGuards(JwtGuard)
  deleteImage(@Query('url') url: string, @Query('fileId') fileId: string) {
    return this.imageService.removeImageByUrl(url, fileId);
  }
}
