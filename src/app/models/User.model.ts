export interface User {
    _id: string,
    name: string,
    email: string,
    password: string,
    createdAt: string | Date,
    updatedAt: string | Date,
    __v: number
}

export interface RegisterUser {
    name: string,
    email: string,
    password: string
}

export interface LoginUser{
    email: string,
    password: string
}
  
  