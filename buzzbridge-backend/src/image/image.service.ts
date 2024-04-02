import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import { User } from 'src/entity/user.entity';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  private imagekit = new ImageKit({
    publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
    privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
    urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT'),
  });

  constructor(private configService: ConfigService) {}
  async getImageKitUrl(user: User, file: Express.Multer.File) {
    this.logger.log('Getting Imagekit Url');
    try {
      const result = await this.imagekit.upload({
        file: file?.buffer,
        fileName: file.originalname,
        folder: '/buzz-bridge',
      });
      return { url: result.url, fileId: result.fileId };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async removeImageByUrl(url: string, fileId: string): Promise<any> {
    try {
      this.logger.log('File to be deleted', fileId);
      const results = await this.imagekit.deleteFile(fileId);
      return results;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
