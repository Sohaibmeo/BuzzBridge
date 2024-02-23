import { Question } from "./QuestionTypes";
import { User } from "./UserTypes";

export interface CreateAnswer {
    description:string,
    questionId:string
}

export interface Answer {
    id: number;
    description: string;
    upvotedBy?: User[]; // Optional relationship
    downvote?: boolean;
    belongsTo?: User; // Optional relationship
    question?: Question; // Optional relationship
}
  