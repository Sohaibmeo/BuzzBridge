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
    picture: URL;
    createdTopics?: number[]; // Optional relationship
    upvotedAnswers?: number[]; // Optional relationship
    topics?: number[]; // Optional relationship
    upvotedQuestions?: number[]; // Optional relationship
    questions?: number[]; // Optional relationship
    answers?: number[]
}

export interface LoginUser {
    username:string,
    password:string,
}