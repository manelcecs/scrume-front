import { UserLogged } from './jwt.domain';

export interface NoteDisplay {
    content: string;
    id: number;
    user: UserLogged;
}