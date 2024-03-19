import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      this.logger.log('Validating credentials...');
      const user = await this.authService.validateUser(username, password);
      if (!user) {
        this.logger.log('JWT Strategy failed');
        throw new UnauthorizedException();
      }
      this.logger.log('Credentials Verified!');
      return user;
    } catch (error) {
      throw error;
    }
  }
}
