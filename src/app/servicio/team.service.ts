import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Team } from '../dominio/team.domain';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class TeamService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getAllTeams() : Observable<Team[]> {
        return this.httpClient.get<Team[]>("/api/team/list?idUser=683", {headers: this.cabeceraService.getBasicAuthentication()});
        // let team1: Team = {
        //     id: 1,
        //     name: "Olimpia",
        //     projects: [{
        //         id: 2,
        //         name: "Dpppppppppppppp",
        //         team: 1
        //     },{
        //         id: 3,
        //         name: "Dp2",
        //         team: 1
        //     }],
        // };
        // let team2: Team = {
        //     id: 4,
        //     name: "Scrume",
        //     projects: [{
        //         id: 5,
        //         name: "Dp3",
        //         team: 1
        //     },{
        //         id: 6,
        //         name: "Dp4",
        //         team: 1
        //     }],
        // };
        // let team3: Team = {
        //     id: 7,
        //     name: "Gamus",
        //     projects: [{
        //         id: 8,
        //         name: "Dp5",
        //         team: 1
        //     },{
        //         id: 9,
        //         name: "Dp6",
        //         team: 1
        //     },{
        //         id: 10,
        //         name: "ispp",
        //         team: 1
        //     }],
        // };
        // let teams:Team[]=[];
        // teams.push(team1);
        // teams.push(team2);
        // teams.push(team3);
        // return teams;

    }


    createTeam(team: Team): Observable<Team> {
        return this.httpClient.post<Team>(this.cabeceraService.getCabecera() + "api/team/save", team, {headers: this.cabeceraService.getBasicAuthentication()});
        // let team1: Team;
        // team1 = {id: 1, name: team.name, projects: []};

        // let response = new Observable(obs => {

        //     setTimeout(() => {

        //         obs.next(team1);

        //     }, 1000);

        // });

        // return response;
    }

    getTeam(id: number):any{
        // return this.httpClient.get<Team>(this.cabeceraService.getCabecera() + "/team?id=" + id);
        
    }

    editTeam(id: number, team: Team):any {
        //FIXME: a cambiar post por put
        return this.httpClient.post<Team>(this.cabeceraService.getCabecera() + "api/team/update?idTeam=" + id, team, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getTeamByProjectID(idProject: number): any {
        //return this.httpClient.get<Team>(this.this.cabeceraService.getCabecera() + "/team?idProject=" + idProject);
        return this.getTeam(1);
    }

    deleteTeam(id: number):any {
        return this.httpClient.delete<Team>(this.cabeceraService.getCabecera() + "api/team/delete?idTeam=" + id, {headers: this.cabeceraService.getBasicAuthentication()});
        
    }

}

