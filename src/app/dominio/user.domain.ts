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

export interface UserRegister {
  box: number;
  expiredDate: string;
  id: number;
  orderId?: string;
  password: string;
  payerId?: string;
  username: string;
  codeId?: number ;
}

export interface SimpleUserNick {
  id: number;
  nick: string;
  photo?: string;
}

export interface Member {
  email: string;
  id: number;
  isAdmin: boolean;
  nickname: string;
}

export interface Renovation {
  box: number;
  expiredDate: string;
  id: number;
  orderId?: string;
  payerId?: string;
  codeId?: number;
}
