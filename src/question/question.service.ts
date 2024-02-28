import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/entity/question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async findOne(id: number) {
    try {
      return await this.questionRepo.findOne({
        where: {
          id: id,
        },
        relations: [
          'upvotedBy',
          'assignedTopics',
          'answers',
          'belongsTo',
          'downvotedBy',
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllByUserId(user: User, page: number, limit: number) {
    try {
      return await this.questionRepo.find({
        where: { belongsTo: user },
        relations: ['upvotedBy', 'downvotedBy', 'belongsTo'],
        skip: (page - 1) * limit || 0,
        take: limit,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.questionRepo.find({
        relations: [
          'upvotedBy',
          'belongsTo',
          'assignedTopics',
          'answers',
          'answers.belongsTo',
          'downvotedBy',
        ],
        // select:
        //     ['id'],
      });
    } catch (error) {
      throw error;
    }
    //TODO: make this query sorted by ubvotes
  }

  async findAllFromUser(user: User) {
    try {
      const questionsList = await this.questionRepo.find({
        where: {
          belongsTo: user,
        },
        relations: [
          'upvotedBy',
          'answers',
          'belongsTo',
          'answers.belongsTo',
          'downvotedBy',
        ],
      });
      const filteredQuestions = questionsList.filter((question) => {
        if (question.answers.length === 0) {
          return false;
        }
        const userAnswer = question.answers.find(
          (answer) => answer.belongsTo.id === user.id,
        );
        if (userAnswer) {
          return {
            ...question,
            answers: [userAnswer],
          };
        } else {
          return false;
        }
      });

      //TODO: change all this into a single query using query builder
      filteredQuestions.sort((a, b) => {
        const aCount =
          (a.upvotedBy?.length || 0) - (a.downvotedBy?.length || 0);
        const bCount =
          (b.upvotedBy?.length || 0) - (b.downvotedBy?.length || 0);
        return bCount - aCount;
      });

      return filteredQuestions;
    } catch (error) {
      throw error;
    }
  }

  async addUpvote(questionId: number, user: User) {
    try {
      const question = await this.questionRepo.findOne({
        where: {
          id: questionId,
        },
        relations: ['downvotedBy'],
      });
      if (question.downvotedBy.some((downvoter) => downvoter.id === user.id)) {
        await this.questionRepo
          .createQueryBuilder()
          .relation(Question, 'downvotedBy')
          .of(questionId)
          .remove(user.id);
      }
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'upvotedBy')
        .of(questionId)
        .add(user.id);

      return 'Upvoted successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async addDownvote(questionId: number, user: User) {
    try {
      const question = await this.questionRepo.findOne({
        where: {
          id: questionId,
        },
        relations: ['upvotedBy'],
      });
      if (question.upvotedBy.some((upvoter) => upvoter.id === user.id)) {
        await this.questionRepo
          .createQueryBuilder()
          .relation(Question, 'upvotedBy')
          .of(questionId)
          .remove(user.id);
      }
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'downvotedBy')
        .of(questionId)
        .add(user.id);
      return 'Downvoted successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async removeUpvote(questionId: number, user: User) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'upvotedBy')
        .of(questionId)
        .remove(user.id);
      return 'Upvote removed successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async removeDownvote(questionId: number, user: User) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'downvotedBy')
        .of(questionId)
        .remove(user.id);
      return 'Downvote removed successfully';
    } catch (error) {
      console.log(error);
    }
  }

  async createQuestion(newQuestion: CreateQuestionDto) {
    try {
      const question = await this.questionRepo
        .createQueryBuilder()
        .insert()
        .into(Question)
        .values(newQuestion)
        .execute();
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'assignedTopics')
        .of(question.identifiers[0].id)
        .add(newQuestion.assignedTopics);
      return 'Succesful';
    } catch (error) {
      throw error;
    }
  }

  async updateQuestion(id: number, updatedQuestion: UpdateQuestionDto) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .update()
        .set(updatedQuestion)
        .where({ id: id })
        .execute();
      return 'Question updated successfully';
    } catch (error) {
      throw error;
    }
  }

  async deleteQuestion(id: number) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .delete()
        .where({ id: id })
        .execute();
      return 'Question deleted successfully';
    } catch (error) {
      throw error;
    }
  }
}
