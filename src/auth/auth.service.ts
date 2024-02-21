import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async login(username:string, password:string) {
        const user = await this.userRepo
                    .findOne({where:{
                        username:username
                    }})
        if(user && await bcrypt.compare(password,user.password)){
            return this.jwtService.sign({username})
        }else{
            return new UnauthorizedException();
        }
    }
    async status(){
        
    }
}
