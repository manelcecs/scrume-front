import { TaskSimple } from './task.domain';
import { Team } from './team.domain';

export interface ProjectDto {
    id?: number;
    description?: String;
    name: string;
    team: number,
}

export interface ProjectComplete {
    id?: number;
    name: string;
    description?: string;
    tasks: TaskSimple[];
}


export interface ProjectName {
    id: number;
    name: String;

}