import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { User, SimpleUserNick, UserNick } from '../dominio/user.domain';

@Injectable({providedIn:'root'})

export class UserService {
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    checkCredentials(user: string, pass: string): Observable<boolean>{
        return this.httpClient.get<boolean>(this.cabeceraService.getCabecera()+"api/login/isAValidUser", {headers: this.cabeceraService.getCustomBasicAuthentication(user, pass)});
    }

    findUserAuthenticated(): Observable<UserNick>{
        return this.httpClient.get<UserNick>(this.cabeceraService.getCabecera()+"api/user/find-by-authorization", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getUser(id: number):Observable<User>{
        return this.httpClient.get<User>(this.cabeceraService.getCabecera()+"api/user/"+id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAllUsersOfWorkspace(id: number){
        return this.httpClient.get<SimpleUserNick[]>(this.cabeceraService.getCabecera()+"api/user/list-by-workspace/"+id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

}