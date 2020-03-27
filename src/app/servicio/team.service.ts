import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Team, TeamSimple } from '../dominio/team.domain';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SprintService } from './sprint.service';

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

    //Sigue sin estar
    getTeam(id: number):any{
        // return this.httpClient.get<Team>(this.cabeceraService.getCabecera() + "/team?id=" + id); 
    }

    getTeamByProjectID(idProject: number): any {
        //return this.httpClient.get<Team>(this.this.cabeceraService.getCabecera() + "/team?idProject=" + idProject);
        return this.getTeam(1);
    }

    

}

@Injectable({providedIn: 'root'})
export class TeamResolverService implements Resolve<any>{

    constructor(private teams: TeamService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        
        let method = activatedRoute.data.method;
        switch(method){
            case 'getTeam':
                return this.teams.getTeam(activatedRoute.data.id);
            default:
                return this.teams.getAllTeams();
        }
    }
}
