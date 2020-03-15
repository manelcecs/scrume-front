import { ProjectComplete } from './project.domain';

export interface Task {
    id?: number;
    //project: number;
    name: string;
    estimate?: number;
    description?: string;
}