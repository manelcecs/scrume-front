import { ProjectName } from './project.domain';
import { UserNick, SimpleUserNick } from './user.domain';
import { ColumDto } from './colum.domian';
import { SprintWorkspace } from './sprint.domain';
import { BoardName } from './board.domain';

export interface TaskDto {
    id?: number;
    title: string;
    description: string;
    project: ProjectName;
    users: SimpleUserNick[];
}

export interface TaskSimple {
    id?: number;
    title: string;
    description?: string;
    estimatedPoints?: number;
    finalPoints?: number;
    column?: ColumDto;
}

export interface TaskBacklog{
    idTask: number;
    sprints: SprintWorkspace[];
}

export interface TaskMove{
    destiny: number;
    task: number;
}

export interface TaskEstimate{
    points: number;
    task: number;
}

export interface TaskAssignable{
    id: number;
    users: UserNick[];
}

export interface TaskToEdit{
    id: number;
    description: string;
    title: string;
    users: number[];
}

export interface TaskToList{
    taskId: number;
    title: string;
    project: ProjectName;
    workspace: BoardName;
    sprint?: number;
}

export interface TaskData {
    description: string;
    points: number;
    title: string;
}