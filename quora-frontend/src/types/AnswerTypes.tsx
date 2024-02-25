import { QuestionType } from "./QuestionTypes";
import { User } from "./UserTypes";

export interface CreateAnswer {
    description:string,
    question:number
}

export interface Answer {
    id: number;
    description: string;
    upvotedBy?: User[]
    downvote?: boolean;
    belongsTo?: User
    question?: number
}
  