import { Task } from './task.domain';

export interface ProjectDto {
    id?: number;
    equipo: number,
    name: String;
    description?: String;
}

export interface ProjectComplete {
    id?: Number;
    name: String;
    description?: String;
    tasks: Task[];
}
