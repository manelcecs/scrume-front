import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { NotificationAlert } from '../dominio/notification.domain';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class AlertService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    crateAlert(alert: NotificationAlert): Observable<NotificationAlert>{
        return this.httpClient.post<NotificationAlert>(this.cabeceraService.getCabecera()+"api/notification", alert, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteAlert(idAlert: number): Observable<void>{
        return this.httpClient.delete<void>(this.cabeceraService.getCabecera() + "api/notification/"+idAlert, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAllAlertsSprint(idSprint: number): Observable<NotificationAlert[]>{
        return this.httpClient.get<NotificationAlert[]>(this.cabeceraService.getCabecera() + "api/notification/list-all-notifications/" + idSprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAlert(idAlert: number): Observable<NotificationAlert>{
        return this.httpClient.get<NotificationAlert>(this.cabeceraService.getCabecera() + "api/notification/" + idAlert, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editAlert(alert: NotificationAlert): Observable<NotificationAlert>{
        return this.httpClient.put<NotificationAlert>(this.cabeceraService.getCabecera()+"api/notification/"+alert.id, alert, {headers: this.cabeceraService.getBasicAuthentication()});
    }
   

}