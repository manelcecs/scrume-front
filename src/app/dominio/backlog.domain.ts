import { Task } from "./task.domain";

export interface Backlog {
    id?: Number;
    taks: Task[];
}