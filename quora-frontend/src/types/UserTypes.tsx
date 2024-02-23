import { Answer } from "./AnswerTypes";
import { Question } from "./QuestionTypes";
import { Topic } from "./TopicTypes";

export interface CreateUser {
    name:string,
    username:string,
    password:string,
    age: number,
    gender:string,
    email:string,
    picture:URL
}

export interface User {
    id: number;
    password: string;
    name: string;
    age: number;
    gender: string;
    email: string;
    username: string;
    picture: string;
    createdTopics?: Topic[]; // Optional relationship
    upvotedAnswers?: Answer[]; // Optional relationship
    topics?: Topic[]; // Optional relationship
    upvotedQuestions?: Question[]; // Optional relationship
    questions?: Question[]; // Optional relationship
    answers?: Answer[]; // Optional relationship
}

export interface LoginUser {
    username:string,
    password:string,
}