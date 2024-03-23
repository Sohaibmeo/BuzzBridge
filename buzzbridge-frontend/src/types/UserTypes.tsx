import { AnswerTypes } from './AnswerTypes';
import { QuestionType } from './QuestionTypes';
import { TopicTypes } from './TopicTypes';

export interface CreateUser {
  name: string;
  username: string;
  password: string;
  age?: number;
  gender?: string;
  email: string;
  about?: string;
  picture?: URL;
}

export interface UserSignUp {
  email: string;
}

export interface User {
  id: number;
  password?: string;
  name: string;
  age?: number;
  gender?: string;
  email: string;
  username: string;
  picture?: URL | null;
  fileId?: string | null;
  about?: string;
  createdTopics?: TopicTypes[];
  upvotedAnswers?: number[];
  downvotedAnswers?: number[];
  topics?: TopicTypes[];
  upvotedQuestions?: QuestionType[];
  questions?: QuestionType[];
  answers?: AnswerTypes[];
}

export interface UpdateUser {
  id?: number;
  password?: string;
  name?: string;
  age?: number;
  gender?: string;
  email?: string;
  username?: string;
  picture?: URL | null;
  about?: string;
  createdTopics?: TopicTypes[];
  upvotedAnswers?: number[];
  downvotedAnswers?: number[];
  topics?: TopicTypes[];
  upvotedQuestions?: QuestionType[];
  questions?: QuestionType[];
  answers?: AnswerTypes[];
}

export interface LoginUser {
  email: string;
  password: string;
}
