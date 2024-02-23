export interface CreateUser {
    name:string,
    username:string,
    password:string,
    age: number,
    gender:string,
    email:string,
    picture:URL
}

export interface LoginUser {
    username:string,
    password:string,
}