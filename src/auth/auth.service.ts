import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    private readonly logger=new Logger(AuthService.name)
    constructor(
        private readonly userService:UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username:string, password:string) {
        const user = await this.userService
        .findOneByUsername(username)
        if(user && (password === user.password || await bcrypt.compare(password,user.password))){
            return this.jwtService.sign({sub: user.id,username:user.username})
        }else{
            this.logger.log("Wrong Credentials"+ user.username)
            return null
        }
    }
    async status(){
        
    }
}
