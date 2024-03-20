import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { User } from '../../entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        // if (req && req.cookies) {
        //   token = req.cookies['jwt'];
        // }
        // get token from basic auth
        if (req.headers.authorization) {
          token = req.headers.authorization.split(' ')[1];
        }
        this.logger.log('Token: ' + token.replace(/"/g, ''));
        return token.replace(/"/g, '');
      },
      //TODO:make this false again
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: User['id']; username: User['username'] }) {
    this.logger.log(payload.username + ' verified!');
    return { id: payload.sub, username: payload.username };
  }
}
