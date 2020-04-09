import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { NotificationAlert } from '../dominio/notification.domain';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class AlertService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    crateAlert(alert: NotificationAlert): Observable<NotificationAlert>{
        return this.httpClient.post<NotificationAlert>(this.cabeceraService.getCabecera()+"api/notification", alert,{headers: this.cabeceraService.getBasicAuthentication()});
    }

}