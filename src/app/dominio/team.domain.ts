import { ProjectDto } from "./project.domain";

export interface Team {
    id?: Number;
    name: String;
    projects: ProjectDto[];

}

export interface TeamName {
    name: String;

}

