import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { User, SimpleUserNick, UserIdUser, UserRegister } from '../dominio/user.domain';
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


    /**
     * @param numberOfProjects Número de proyectos en los que es admin o miembro.
     * @description Recibe el número de proyectos y el método se encarga de comparar el plan mínimo del equipo con la restricción correspondiente.
     * @returns true si es no ha violado la restricción del plan, false en caso contrario.
     */
    checkNumberOfProjects(idTeam: number, numberOfProjects: number): boolean {
      var box: string = this.getUserLogged().nameBox;
      var res: boolean = true;
      switch (box) {
        case "BASIC": {
          if (numberOfProjects >= 1) {
            res = false;
          }
        }
        case "STANDARD": {
          if (numberOfProjects >= 3) {
            res = false;
          }
        }
      }
      return res;
    }

    /**
     * @param numberOfSprints Número de sprints de un proyecto.
     * @description Recibe el número de sprints de un proyecto y el método se encarga de comparar el plan mínimo del equipo con la restricción correspondiente.
     * @returns true si es no ha violado la restricción del plan, false en caso contrario.
     */
    checkNumberOfSprints(idTeam: number, numberOfSprints: number): boolean {
      var box: string = this.getUserLogged().nameBox;
      var res: boolean = true;
      if (box == "BASIC") {
          if (numberOfSprints >= 1) {
            res = false;
          }
        }
      return res;
    }

     /**
     * @param numberOfProjects Número de tableros de un sprint.
     * @description Recibe el número de tableros de un sprint y el método se encarga de comparar el plan mínimo del equipo con la restricción correspondiente.
     * @returns true si es no ha violado la restricción del plan, false en caso contrario.
     */
    checkNumberOfBoards(idTeam: number, numberOfBoards: number): boolean {
      var box: string = this.getUserLogged().nameBox;
      var res: boolean = true;
      switch (box) {
        case "BASIC": {
          if (numberOfBoards >= 1) {
            res = false;
          }
        }
        case "STANDARD": {
          if (numberOfBoards >= 2) {
            res = false;
          }
        }
      }
      return res;
    }



}
