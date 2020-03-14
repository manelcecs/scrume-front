import { ProjectName } from './project.domain';
import { TeamName } from './team.domain';

export interface TaskDto {
    id?: Number;
    title: String;
    descripcion: String;
    points: Number;
    project: ProjectName;
    team: TeamName;

}