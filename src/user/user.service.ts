import { Injectable } from '@nestjs/common';
import { createUserDto } from './dto/createUserDto';

@Injectable()
export class UserService {
    
    findOne(id: string) {
        return{
            id: id,
            name:"Sohaib",
            email:"whatever@whatever.com",
        }
    }

    createUser(userGiven:createUserDto){
        return "we should really push this user"
    }
}
