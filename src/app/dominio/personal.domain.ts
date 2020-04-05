import { TeamName } from './team.domain';
import { TaskData } from './task.domain';

export interface PersonalDataAll {
    id?: number;
    email: string;
    gitUser: string;
    name: string;
    nick: string;
    photo: string;
    surnames: string;
    tasks: TaskData[];
    teams: TeamName[];
  }