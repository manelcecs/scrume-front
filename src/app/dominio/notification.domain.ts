import { TeamSimple } from './team.domain';

export interface NotificationAlert{
    id?: number;
    idSprint?: number;
    date: Date;
    sprint?: number;
    title: string;
    isDaily?: boolean;
    admin?: boolean;
    team?: TeamSimple;
}
