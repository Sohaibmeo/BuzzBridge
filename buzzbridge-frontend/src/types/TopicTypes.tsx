import { QuestionType } from "./QuestionTypes";
import { User } from "./UserTypes";
export interface TopicTypes {
  id: number;
  title: string;
  description?: string;
  picture?: URL;
  belongsTo?: User;
  followers?: User[];
  questions?: QuestionType[];
}

export interface UpdateTopic extends Partial<CreateTopic> {}
export interface CreateTopic {
  title: string;
  description?: string;
  picture?: Blob | MediaSource;
  fileId?: string;
}
