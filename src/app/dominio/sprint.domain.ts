import { ProjectName } from './project.domain';

export interface SprintDisplay {
    id: number;
    startDate: Date;
    endDate: Date;
    project?: number;
    totalTasks: number;
    completedTasks: number;
    totalHP: number;
    completedHP: number;
}

export interface Sprint {
  id?: number;
  project?: ProjectName;
  startDate: Date;
  endDate: Date;
}

export interface SprintJsonDates {
  id?: number;
  project?: ProjectName;
  startDate: string;
  endDate: string;
}
