import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Backlog } from '../dominio/backlog.domain';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class BacklogService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getBacklog(){
        return null;
    }

}

