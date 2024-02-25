import { Answer } from "./AnswerTypes";
import { TopicTypes } from "./TopicTypes";
import { User } from "./UserTypes";

export interface CreateQuestion {
    title:string,
    picture?:URL,
    assignedTopics:number[]
}

export interface QuestionType {
    id: number;
    title: string;
    picture?: URL;
    upvotedBy?: User[];
    downvote?: boolean;
    belongsTo?: User;
    assignedTopics?: TopicTypes[];
    answers?: Answer[];
}