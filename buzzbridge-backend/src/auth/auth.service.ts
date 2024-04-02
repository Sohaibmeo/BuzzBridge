import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../entity/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  sign(body: any) {
    return this.jwtService.sign({ body });
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      if (
        password === user.password ||
        (await bcrypt.compare(password, user.password))
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return {
          jwt: this.jwtService.sign({ email: user.email, sub: user.id }),
          data: result,
        };
      } else {
        throw new Error('Invalid Credentials');
      }
    } catch (error) {
      throw error.message;
    }
  }

  async resetPasswordWithOldPassword(
    user: User,
    password: string,
    newPassword: string,
  ) {
    try {
      this.logger.log(user, password, newPassword);
      const response = await this.validateUser(user.email, password);
      if (!response.data) {
        throw new Error('Invalid Credentials');
      }
      await this.userService.updateUserPassword(user, newPassword);
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async resetPasswordWithOldPasswordInToken(
    newPassword: string,
    token: string,
  ) {
    try {
      const { email, password } = this.jwtService.verify(token);
      const response = await this.validateUser(email, password);
      if (!response.data) {
        throw new Error('Invalid Token');
      }
      return await this.userService.updateUserPassword(
        response.data as User,
        newPassword,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async resetPassword(newPassword: string, token: string) {
    try {
      const { email } = this.jwtService.verify(token);
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      return await this.userService.updateUserPassword(user, newPassword);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async confirmVerificationEmail(token: string): Promise<any> {
    try {
      const { email, username, name, password } = this.jwtService.verify(token);
      await this.userService.registerUser({ email, username, name, password });
      this.logger.log('User Verified');
      return { email, username, name, password };
    } catch (error) {
      throw error;
    }
  }
}
