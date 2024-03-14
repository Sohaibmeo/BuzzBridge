import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
  constructor(private readonly userService: UserService) {}
  async sendEmail(userEmail: string) {
    const tempCreds = await this.userService.registerUser(userEmail);
    return tempCreds;
  }
}
