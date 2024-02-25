import { QuestionType } from "./QuestionTypes";

export interface TopicTypes {
    id: number;
    title: string;
    description: string;
    picture: URL;
    belongsTo?: number[]
    followers?: number[]
    questions?: QuestionType[]
  }

export interface CreateTopic {
    title:string,
    description:string,
    picture:URL
}