import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Breach } from '../dominio/breach.domain';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class SecurityBreachService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    updateSecurityBreach(breach: Breach): Observable<Breach> {
        return this.httpClient.put<Breach>(this.cabeceraService.getCabecera() + "api/administrator", breach, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getSecurityBreach(): Observable<Breach> {
        return this.httpClient.get<Breach>(this.cabeceraService.getCabecera() + "api/administrator", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    isAdmin(): Observable<boolean> {
        return this.httpClient.get<boolean>(this.cabeceraService.getCabecera() + "api/user/isAdmin", {headers: this.cabeceraService.getBasicAuthentication()});
    }

}