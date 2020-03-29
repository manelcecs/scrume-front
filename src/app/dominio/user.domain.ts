export interface UserName {
    name: string;

}

export interface UserIdUser {
  idUser: number;
}

export interface UserNick {
  id: number;
  nick: string;
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

export interface SimpleUserNick {
  id: number;
  nick: string;
  photo?: string;
}
