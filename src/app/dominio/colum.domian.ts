import { TaskDto } from './task.domain';
import { Board } from './board.domain';

export interface ColumDto {
    id?: number;
    name: string;
    tasks: TaskDto[];

}
