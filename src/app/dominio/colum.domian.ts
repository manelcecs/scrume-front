import { TaskDto } from './task.domain';

export interface ColumDto {
    id?: number;
    name: string;
    tasks: TaskDto[];

}
