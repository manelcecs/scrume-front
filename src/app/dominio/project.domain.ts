import { Task } from './task.domain';

export interface ProjectDto {
    id?: number;
    team: number,
    name: String;
    description?: String;
}

export interface ProjectComplete {
    id?: Number;
    name: String;
    description?: String;
    tasks: Task[];
}
