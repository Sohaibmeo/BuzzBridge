import { Question } from "./QuestionTypes";
import { User } from "./UserTypes";

export interface Topic {
    id: number;
    title: string;
    description: string;
    picture: string;
    belongsTo?: User; // Optional relationship
    followers?: User[]; // Optional relationship
    questions?: Question[]; // Optional relationship
  }

export interface CreateTopic {
    title:string,
    description:string,
    picture:URL
}