import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/entity/topic.entity';
import { Repository } from 'typeorm';
import { CreateTopicDto, UpdateTopicDto } from './dto/topicDto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic) private readonly topicRepo: Repository<Topic>
    ) {}

    findOne(id:number){
        return this.topicRepo.findOne({where:{
            id:id
        }})
    }

    findAll(){
        return this.topicRepo.find()
    }

    createTopic(newTopic:CreateTopicDto){
        const topic = this.topicRepo.create(newTopic)
        this.topicRepo.save(topic)
        return "Created Succussfully"
    }

    updateTopic(id:number, updatedTopic:UpdateTopicDto){
        this.topicRepo.update(id,updatedTopic)
        return "updated succesfully"
    }
    deleteTopic(id:number){
        this.topicRepo.delete(id)
        return "deleted succesfully"
    }
}
