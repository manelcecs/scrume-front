import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { ColumDto } from '../dominio/colum.domian';

@Injectable({providedIn:'root'})

export class BoardService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getTaskForColums()/*:Observable<Colum>*/{
        // return this.httpClient.get<Column>(this.cabeceraService.getCabecera() + "/colum");
        let colum1: ColumDto = {
            id: 1,
            name: "To Do",
            tareas: [{
                id: 2,
                title: "Presentación",
                descripcion: "Preparar la presentación",
                points: 12,
                project: {
                    name: "DP"
                },
                team: {
                    name: "Olimpia"
                }
            }],
        };
        let colum2: ColumDto = {
            id: 1,
            name: "In Progress",
            tareas: [{
                id: 2,
                title: "Integración",
                descripcion: "Integra node.js y spring",
                points: 12,
                project: {
                    name: "DP"
                },
                team: {
                    name: "Olimpia"
                }
            }],
        };
        let colum3: ColumDto = {
            id: 1,
            name: "Done",
            tareas: [{
                id: 2,
                title: "Aprobar DP",
                descripcion: "Regalar un jamón",
                points: 12,
                project: {
                    name: "DP"
                },
                team: {
                    name: "Olimpia"
                }
            }],
        };
        let colums:ColumDto[]=[];
        colums.push(colum1);
        colums.push(colum2);
        colums.push(colum3);
        return colums;
    }

    

}