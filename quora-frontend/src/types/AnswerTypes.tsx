import { QuestionType } from './QuestionTypes';
import { User } from './UserTypes';

export interface CreateAnswer {
  description: string | null;
  question: number;
}

export interface AnswerTypes {
  id: number;
  description: string;
  upvotedBy?: User[];
  downvotedBy?: User[];
  belongsTo?: User;
  question?: QuestionType;
  score?: number;
}
