import { ColumDto } from './colum.domian';

export interface Board {
    id?: Number;
    name: String;
    columns: ColumDto[];
}

export interface BoardColumnTODO {
    id?: number;
    name: string;
    column: number;
}