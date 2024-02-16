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
        },
        relations: {
            // answers: true,
            // topics: true,
            // createdTopics: true,
            upvotedAnswers: true
        }
    })
    }

    async findAll() {
        return await this.userRepository.find({
            relations: {
                answers: true,
                topics: true,
                createdTopics: true
            }
        })
    }

    async createUser(userGiven:CreateUserDto){
        try {
            return await this.userRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(userGiven)
                .execute()
        } catch (error) {
            return error
        }
    }

    async updateUser(id:number,updateUser:UpdateUserDto){
        try {
            await this.userRepository
                .createQueryBuilder()
                .update()
                .set(updateUser)
                .where({id:id})
                .execute()
            return 'user updated'
        } catch (error) {
            return error
        }
    }

    deleteUser(id:number){
        try {
            this.userRepository
                .createQueryBuilder()
                .delete()
                .where({id:id})
                .execute()
            return 'user deleted'
        } catch (error) {
            return error
        }
    }
}
