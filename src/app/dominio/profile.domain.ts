export interface Profile {
    id?: number,
    gitUser: string,
    name: string,
    nick: string,
    photo: string,
    surnames: string,
    previousPassword: string,
    newPassword: string
}

export interface ProfileSave {
    id?: number,
    gitUser: string,
    name: string,
    nick: string,
    photo: string,
    surnames: string,
    idUserAccount: number
}