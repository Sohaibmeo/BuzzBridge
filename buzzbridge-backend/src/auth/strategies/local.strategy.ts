import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { HttpException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      this.logger.log('Validating credentials...');
      const user = await this.authService.validateUser(email, password);
      this.logger.log('Credentials Verified!');
      return user;
    } catch (error) {
      this.logger.error(error);
      return new HttpException('Invalid Credentials', 401);
    }
  }
}
