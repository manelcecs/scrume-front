import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { Profile } from '../dominio/profile.domain';

@Injectable({providedIn:'root'})

export class ProfileService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    editProfile(profile: Profile): Observable<Profile> {
        return this.httpClient.put<Profile>(this.cabeceraService.getCabecera() + "api/user/" + profile.id, profile, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getProfile(idPro: number): Observable<Profile> {
        return this.httpClient.get<Profile>(this.cabeceraService.getCabecera()+ "api/user/" + idPro, {headers: this.cabeceraService.getBasicAuthentication()});
    }
}