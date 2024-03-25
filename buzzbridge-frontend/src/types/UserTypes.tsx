import { AnswerTypes } from "./AnswerTypes";
import { QuestionType } from "./QuestionTypes";
import { TopicTypes } from "./TopicTypes";

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
  email: string;
  username: string;
  name: string;
  age?: number;
  gender?: string;
  fileId?: string | null;
  picture?: string | null;
  about?: string;
  createdTopics?: TopicTypes[];
  upvotedAnswers?: number[];
  downvotedAnswers?: number[];
  topics?: TopicTypes[];
  upvotedQuestions?: QuestionType[];
  questions?: QuestionType[];
  answers?: AnswerTypes[];
}

export interface UpdateUser extends Partial<User> {
  picture?: any;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface ResetPassword {
  newPassword: string;
  confirmPassword: string;
}
