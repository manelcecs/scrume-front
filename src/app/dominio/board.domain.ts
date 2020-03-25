import { ColumDto } from './colum.domian';
import { SprintComponent } from '../sprint/sprint.component';
import { SprintDisplay, Sprint } from './sprint.domain';

export interface Board {
    id?: Number;
    name: string;
    columns: ColumDto[];
}

export interface BoardColumnTODO {
    id?: number;
    name: string;
    column: number;
}

export interface BoardSimple {
    id?: number;
    name: string;
    sprint: Sprint;
}

export interface BoardNumber {
    id?: number;
    name: string;
    sprint: number;
}