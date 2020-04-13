import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { User, SimpleUserNick, UserIdUser, UserRegister, Renovation } from '../dominio/user.domain';
import { Box } from '../dominio/box.domain';
import { JWToken, UserLog, UserLogged } from '../dominio/jwt.domain';
import * as jwt_decode from 'jwt-decode';

@Injectable({providedIn:'root'})

export class UserService {
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

     findUserAuthenticated(): Observable<UserIdUser>{
         return this.httpClient.get<UserIdUser>(this.cabeceraService.getCabecera()+"api/user/find-by-authorization", {headers: this.cabeceraService.getBasicAuthentication()});
     }

    getToken(userlog: UserLog) : Observable<JWToken>{
      return this.httpClient.post<JWToken>(this.cabeceraService.getCabecera()+"api/login/authenticate", userlog);
    }

    getUser(id: number):Observable<User>{
        return this.httpClient.get<User>(this.cabeceraService.getCabecera()+"api/user/"+id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAllUsersOfWorkspace(id: number){
        return this.httpClient.get<SimpleUserNick[]>(this.cabeceraService.getCabecera()+"api/user/list-by-workspace/"+id, {headers: this.cabeceraService.getBasicAuthentication()});
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

    getUserLogged(): UserLogged{
      let userLogged : UserLogged = jwt_decode(sessionStorage.getItem("loginToken"))['userLoginDto'];
      return userLogged;
    }

    renovateBox(data: Renovation): Observable<JWToken> {
      return this.httpClient.post<JWToken>(this.cabeceraService.getCabecera() + "api/payment/pay", data, {headers: this.cabeceraService.getBasicAuthentication()});
    }






}
