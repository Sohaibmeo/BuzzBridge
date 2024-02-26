import { AnswerTypes } from './AnswerTypes';
import { TopicTypes } from './TopicTypes';
import { User } from './UserTypes';

export interface CreateQuestion {
  title: string;
  picture?: URL;
  assignedTopics: number[];
}

export interface QuestionType {
  id: number;
  title: string;
  picture?: URL;
  upvotedBy?: User[];
  downvotedBy?: User[];
  belongsTo?: User;
  assignedTopics?: TopicTypes[];
  answers?: AnswerTypes[];
}
