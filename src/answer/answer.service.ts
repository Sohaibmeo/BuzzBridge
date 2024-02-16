import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entity/answer.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDto, UpdateAnswerDto, UpvoteAnswerDto } from './dto/answer.dto';

@Injectable()
export class AnswerService {
    private readonly logger=new Logger(AnswerService.name)
    constructor (
        @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>
    ){}

    async getUpvoteCount(answerId: number){
        try {
            const answer = await this.answerRepo.findOne({where:{
                id:answerId
            },
            relations: {
                upvotedBy:true
            }});
            if (!answer) {
                throw new Error('Answer not found');
            }
            const totalUpvotes = answer.upvotedBy.length;
    
            return totalUpvotes;
        } catch (error) {
            return error
        }
    }

    async addUpvote(answerId:number,userId:number){
        try {
            await this.answerRepo
                .createQueryBuilder()
                .relation(Answer, 'upvotedBy')
                .of(answerId)
                .add(userId)
            return "upvoted succesfully"
        } catch (error) {
            return error
        }
    }
    async removeUpvote(answerId:number,userId:number){
        try {
            await this.answerRepo
                .createQueryBuilder()
                .relation(Answer, 'upvotedBy')
                .of(answerId)
                .remove(userId)
            return "upvote removed succesfully"
        } catch (error) {
            return error
        }
    }
    async createAnswer(newAnswer: CreateAnswerDto){
        try {
            return await this.answerRepo
                .createQueryBuilder()
                .insert()
                .into(Answer)
                .values(newAnswer)
                .execute()
        } catch (error) {
            return error.message
        }
    }
    async updateAnswer(id:number,updatedAnswer: UpdateAnswerDto){
        try {
            return await this.answerRepo
                .createQueryBuilder()
                .update()
                .set(updatedAnswer)
                .where({id:id})
                .execute()
        } catch (error) {
            return error
        }
    }
    async deleteAnswer(answerId: number){
        try {
            await this.answerRepo
                .createQueryBuilder()
                .delete()
                .where({id:answerId})
                .execute()
            return "Deleted Succesfully"
        } catch (error) {
            return error
        }
    }
}
