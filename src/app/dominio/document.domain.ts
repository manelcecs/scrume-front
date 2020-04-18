export interface Document {
    id?: number;
    name: string;
    type: string;
    content: string;
    sprint: number;
}

export interface DailyComponent{
    daily: Daily[];
}

export interface Daily{
    name: string;
    done: string;
    doing: string;
    problems: string;
}