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

  getImagekitAuth() {
    this.logger.log('Getting Imagekit Auth');
    try {
      const authenticationParameters =
        this.imagekit.getAuthenticationParameters();
      return authenticationParameters;
    } catch (error) {
      throw error;
    }
  }
  async getImageKitUrl(user: User, fileName: string) {
    this.logger.log('Getting Imagekit Url');
    try {
      return { user: user, name: fileName };
    } catch (error) {
      throw error;
    }
  }
}
