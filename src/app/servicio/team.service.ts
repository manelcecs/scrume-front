import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Team, TeamSimple } from '../dominio/team.domain';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Member } from '../dominio/user.domain';
import { Box } from '../dominio/box.domain';

@Injectable({providedIn:'root'})

export class TeamService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}



    createTeam(team: TeamSimple): Observable<TeamSimple> {
        return this.httpClient.post<TeamSimple>(this.cabeceraService.getCabecera() + "api/team", team, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editTeam(team: TeamSimple): Observable<TeamSimple> {
        return this.httpClient.put<TeamSimple>(this.cabeceraService.getCabecera() + "api/team/" + team.id, team, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteTeam(id: number): Observable<Team> {
        return this.httpClient.delete<Team>(this.cabeceraService.getCabecera() + "api/team/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getAllTeams() : Observable<Team[]> {
        return this.httpClient.get<Team[]>(this.cabeceraService.getCabecera() + "api/team/list", {headers: this.cabeceraService.getBasicAuthentication()});
    }


    getTeam(id: number):Observable<Team>{
      return this.httpClient.get<Team>(this.cabeceraService.getCabecera() + "api/team/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getTeamByProjectID(idProject: number): any {
        //return this.httpClient.get<Team>(this.this.cabeceraService.getCabecera() + "/team?idProject=" + idProject);
        return this.getTeam(1);
    }

    getTeamMembers(idTeam : number): Observable<Member[]>{
      return this.httpClient.get<Member[]>(this.cabeceraService.getCabecera() + "api/team/list-members/" + idTeam, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    changeRol(idTeam:number, idMember:number, admin: boolean):Observable<any> {
      let data = {"idTeam": idTeam,"idUser": idMember,"admin": admin};
      return this.httpClient.post<any>(this.cabeceraService.getCabecera() + "api/team/change-rol", data,{headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteFromTeam(idTeam:number, idMember:number):Observable<any> {
      return this.httpClient.get<any>(this.cabeceraService.getCabecera() + "api/team/remove-from-team/"+ idMember + "/" + idTeam, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    leaveTeam(idTeam:number): Observable<any>{
      return this.httpClient.get<any>(this.cabeceraService.getCabecera() + "api/team/team-out/" + idTeam,{headers: this.cabeceraService.getBasicAuthentication()});
    }

    getMinimumBox(idTeam:number): Observable<Box> {
      return this.httpClient.get<Box>(this.cabeceraService.getCabecera() + "api/box/minimum-box/" + idTeam,{headers: this.cabeceraService.getBasicAuthentication()});
    }



}

@Injectable({providedIn: 'root'})
export class TeamResolverService implements Resolve<any>{

    constructor(private teams: TeamService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        let method = activatedRoute.queryParams.method;
        if(method === 'getTeam'){
            return this.teams.getTeam(activatedRoute.queryParams.id);
        }else{
            return this.teams.getAllTeams();
        }
    }
}
