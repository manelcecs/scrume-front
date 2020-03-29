import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint } from '../dominio/sprint.domain';
import { TaskSimple, TaskDto, TaskMove, TaskEstimate } from '../dominio/task.domain';
import { Board } from '../dominio/board.domain';
import { User, UserRegister } from '../dominio/user.domain';
import { Box } from '../dominio/box.domain';

@Injectable({providedIn:'root'})

export class UserService {
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    checkCredentials(user: string, pass: string){
        return this.httpClient.get<boolean>(this.cabeceraService.getCabecera()+"api/login/isAValidUser", {headers: this.cabeceraService.getCustomBasicAuthentication(user, pass)});
    }

    findUserAuthenticated(){
        return this.httpClient.get<User>(this.cabeceraService.getCabecera()+"api/user/find-by-authorization", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAllBoxes() : Observable<Box[]>{
      return this.httpClient.get<Box[]>(this.cabeceraService.getCabecera() + "api/box/all", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    isValidEmail(email : string) : Observable<boolean> {
      let data = {"username": email};
      return this.httpClient.post<boolean>(this.cabeceraService.getCabecera() + "api/login/isAValidEmail", data, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    registerUser(user: UserRegister) : Observable<UserRegister> {
      return this.httpClient.post<UserRegister>(this.cabeceraService.getCabecera() + "api/login", user);
    }

}
