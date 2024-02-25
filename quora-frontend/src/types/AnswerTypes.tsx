import { QuestionType } from './QuestionTypes';
import { User } from './UserTypes';

export interface CreateAnswer {
  description: string;
  question: number;
}

export interface AnswerTypes {
  id: number;
  description: string;
  upvotedBy?: User[];
  downvote?: boolean;
  belongsTo?: User;
  question?: QuestionType;
}
