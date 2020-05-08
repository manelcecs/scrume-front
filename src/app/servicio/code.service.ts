import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class CodeService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    validateCode(code: string): Observable<number> {
        return this.httpClient.get<number>(this.cabeceraService.getCabecera() 
            + "api/discount-code/isAValidCode/" + code, 
            {headers: this.cabeceraService.getBasicAuthentication()});

    }
}
