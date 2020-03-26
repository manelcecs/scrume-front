import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint } from '../dominio/sprint.domain';
import { TaskSimple, TaskDto, TaskMove, TaskEstimate } from '../dominio/task.domain';
import { Board } from '../dominio/board.domain';
import { User, SimpleUserNick } from '../dominio/user.domain';

@Injectable({providedIn:'root'})

export class UserService {
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    checkCredentials(user: string, pass: string){
        return this.httpClient.get<boolean>(this.cabeceraService.getCabecera()+"api/login/isAValidUser", {headers: this.cabeceraService.getCustomBasicAuthentication(user, pass)});
    }

    findUserAuthenticated(){
        return this.httpClient.get<User>(this.cabeceraService.getCabecera()+"api/user/find-by-authorization", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAllUsersOfWorkspace(id: number){
        return this.httpClient.get<SimpleUserNick[]>(this.cabeceraService.getCabecera()+"api/user/list-by-workspace/"+id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

}