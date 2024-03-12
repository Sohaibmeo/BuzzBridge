import { QuestionType } from './QuestionTypes';
import { User } from './UserTypes';

export interface TopicTypes {
  id: number;
  title: string;
  description: string;
  picture: URL;
  belongsTo?: number[];
  followers?: User[];
  questions?: QuestionType[];
}

export interface CreateTopic {
  title: string;
  description: string;
  picture: any | null;
}
