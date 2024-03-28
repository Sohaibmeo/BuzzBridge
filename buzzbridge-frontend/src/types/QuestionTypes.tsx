import { AnswerTypes } from "./AnswerTypes";
import { TopicTypes } from "./TopicTypes";
import { User } from "./UserTypes";

export interface CreateQuestion {
  title: string;
  picture?: Blob;
  fileId?: string;
  assignedTopics: number[];
}

export interface UpdateQuestion extends Partial<CreateQuestion> {}

export interface QuestionType {
  id: number;
  title: string;
  picture?: URL;
  fileId?: string;
  upvotedBy?: User[];
  downvotedBy?: User[];
  belongsTo?: User;
  assignedTopics?: TopicTypes[];
  answers?: AnswerTypes[];
  score?: number;
}
