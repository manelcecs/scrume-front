import { ColumDto } from './colum.domian';
import { Sprint } from './sprint.domain';

export interface Board {
    id?: number;
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

export interface BoardName{
    id: number;
    name: string;
}