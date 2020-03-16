export interface SprintDisplay {
    id: number;
    starDate: Date;
    endDate: Date;
    totalTasks: number;
    completedTasks: number;
    totalHP: number;
    completedHP: number;
}

export interface Sprint {
  id?: number;
  project?: number;
  starDate: Date;
  endDate: Date;
}
