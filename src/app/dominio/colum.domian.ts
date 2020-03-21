import { TaskDto } from './task.domain';
import { Board } from './board.domain';

export interface ColumDto {
    id?: Number;
    name: String;
    tareas: TaskDto[];
}
