import { ProjectName } from './project.domain';
import { UserName } from './user.domain';

export interface TaskDto {
    id?: number;
    title: string;
    description: string;
    points: number;
    project: ProjectName;
}

export interface TaskSimple {
    id?: number;
    title: string;
    description?: string;
    points?: number;
}

export interface TaskMove {
    id?: number;
    destiny: number;
    task: number;
}