export class JWToken {
    token: string;
}

export class UserLog{
    username: string;
    password: string;
}

export class UserLogged {
    idUser : number;
    username: string;
    endingBoxDate : BoxDate;
}

export class BoxDate {
    dayOfMonth : number;
    year: number;
    monthValue : number;
}