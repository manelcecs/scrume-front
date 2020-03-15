import { Task } from './task.domain';
import { Team } from './team.domain';

export interface ProjectDto {
    id?: number;
    name: string;
    equipo?: number,
    description?: string;
}

export interface ProjectComplete {
    id?: number;
    name: string;
    description?: string;
    tasks: Task[];
}
