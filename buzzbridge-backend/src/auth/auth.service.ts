import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private imagekit = new ImageKit({
    publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
    privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
    urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT'),
  });
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (
      user &&
      (password === user.password ||
        (await bcrypt.compare(password, user.password)))
    ) {
      return this.jwtService.sign({ sub: user.id, username: user.username });
    } else {
      this.logger.log('Wrong Credentials' + user.username);
      return null;
    }
  }

  async getImageKitUrl(user: User, file: Express.Multer.File) {
    this.logger.log('Getting Imagekit Url');
    try {
      const result = await this.imagekit.upload({
        file: file?.buffer,
        fileName: file.originalname,
        folder: '/buzz-bridge',
      });
      console.log(result);
      return { url: result.url, fileId: result.fileId };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeImageByUrl(url: string, fileId: string): Promise<any> {
    this.logger.log('Deleting Image from Imagekit');
    try {
      console.log('File to be deleted', fileId);
      const results = await this.imagekit.deleteFile(fileId);
      return results;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
