import { ProjectName } from './project.domain';
import { UserName } from './user.domain';

export interface TaskDto {
    id?: Number;
    title: String;
    descripcion: String;
    points: Number;
    project: ProjectName;
}