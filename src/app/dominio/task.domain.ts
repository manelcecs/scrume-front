import { ProjectName } from './project.domain';
import { UserName } from './user.domain';
import { ColumDto } from './colum.domian';
import { SprintWorkspace } from './sprint.domain';

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
    column?: ColumDto;
}

export interface TaskBacklog{
    idTask: number;
    sprints: SprintWorkspace[];
}