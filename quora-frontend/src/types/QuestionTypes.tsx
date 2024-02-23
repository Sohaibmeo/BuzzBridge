import { Answer } from "./AnswerTypes";
import { Topic } from "./TopicTypes";
import { User } from "./UserTypes";

export interface CreateQuestion {
    title:string,
    description:string,
    image:string,
    assignedTopics:number[]
}

export interface Question {
    id: number;
    title: string;
    description: string;
    image: string;
    upvotedBy?: User[];
    downvote?: boolean;
    belongsTo?: User;
    assignedTopics?: Topic[];
    answers?: Answer[];
}