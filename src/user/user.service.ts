import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    findOne(id: number) {
        return this.userRepository.findOne({where:{
            id:id
        }})
    }

    async findAll() {
        return await this.userRepository.find()
    }

    async createUser(userGiven:CreateUserDto){
        const user = this.userRepository.create(userGiven)
        return await this.userRepository.save(user)
    }

    updateUser(id:number,updateUser:UpdateUserDto){
        this.userRepository.update(id,updateUser)
        return 'user updated'
    }

    deleteUser(id:number){
        this.userRepository.delete(id)
        return 'user deleted'
    }
}
