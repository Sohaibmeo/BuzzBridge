import { AnswerTypes } from "./AnswerTypes";
import { QuestionType } from "./QuestionTypes";
import { TopicTypes } from "./TopicTypes";

export interface CreateUser {
  name: string;
  username: string;
  password: string;
  age?: number;
  gender?: string | null;
  email: string;
  about?: string;
  picture?: Blob | MediaSource;
  fileId?: string;
}

export interface UserSignUp {
  email: string;
}

export interface UserChangeEmail {
  email: string;
  confirmEmail: string;
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
  questions?: QuestionType[];
  answers?: AnswerTypes[];

  upvotedAnswers?: number[];
  downvotedAnswers?: number[];
  topics?: TopicTypes[];
  upvotedQuestions?: QuestionType[];
  downvotedQuestions?: QuestionType[];
}

export interface UpdateUser extends Partial<CreateUser> {}

export interface LoginUser {
  username: string;
  password: string;
}

export interface ResetPassword {
  newPassword: string;
  confirmPassword: string;
  password?: string;
}
