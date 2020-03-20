import { ColumDto } from './colum.domian';

export interface Board {
    id?: Number;
    name: String;
    colums: ColumDto[];

}

export interface BoardSimple {
    id?: number;
    name: String;
    sprint: number;

}