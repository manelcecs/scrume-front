export interface UserName {
    name: string;

}

export interface UserNick {
  id: number;
  email: string;
}

export interface User{
    
    id?: number;
    gitUser: string;
    name: string;
    nick: string;
    photo: string;
    surnames: string;
    userAccount: any;

}