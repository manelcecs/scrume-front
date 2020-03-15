import { ProjectDto } from "./project.domain";

export interface Team {
    id?: number;
    name: String;
    projects: ProjectDto[];

}

