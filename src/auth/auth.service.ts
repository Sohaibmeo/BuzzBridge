import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) {}

    async login(username:string, password:string){
        const user = await this.userRepo
                    .findOne({where:{
                        username:username
                    }})
        if(!user){
            return "Username does not exist"
        }
        this.logger.log("Result is " + await bcrypt.compare(password,user.password))
        if(await bcrypt.compare(password,user.password)){
            return "User Matched"
        }else{
            return "Wrong Password"
        }
    }
    async status(){
        
    }
}
