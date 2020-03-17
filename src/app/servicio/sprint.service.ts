import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint, SprintJsonDates } from '../dominio/sprint.domain';

@Injectable({providedIn:'root'})

export class SprintService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getSprintsOfProject(idProject : number): Observable<Sprint[]>{
      return this.httpClient.get<Sprint[]>("/api/sprint/list?idProject=" + idProject, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getStatisticsOfSprint(idSprint : number): Observable<SprintDisplay>{
      return this.httpClient.get<SprintDisplay>("/api/sprint/statistics?idSprint=" + idSprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    createSprint(sprint : SprintJsonDates) : Observable<Sprint>{
      // let sprint1 : Sprint;
      // sprint1 = {id : 1, starDate: sprint.starDate, endDate: sprint.endDate, project: 1};

      // let response = new Observable(obs => {
      //     setTimeout(() => {
      //         obs.next(sprint1);
      //     }, 1000);
      // });

      return this.httpClient.post<Sprint>(this.cabeceraService.getCabecera() + "api/sprint/save", sprint, {headers: this.cabeceraService.getBasicAuthentication()});

    }

    editSprint(id: number, sprint : Sprint) : any {
      // return this.httpClient.post<Sprint>(this.cabeceraService.getCabecera() + "/sprint?id=" + id, sprint);
      let response = new Observable(obs => {
          setTimeout(() => {
              obs.next(sprint);
          }, 1000);
      });

      return response;
    }

    deleteSprint(id: number):any {
      // return this.httpClient.post<Sprint>(this.cabeceraService.getCabecera() + "/sprint?id=" + id, sprint);
    }

    getSprint(id: number) : SprintDisplay {
      let sprint1 : SprintDisplay = {
        id: 1,
        startDate: new Date("2019-01-16"),
        endDate: new Date("2019-02-16"),
        totalTasks: 20,
        completedTasks: 15,
        totalHP: 100,
        completedHP: 76,
      }
      return sprint1;
      // return this.httpClient.get<Sprint>(this.cabeceraService.getCabecera() + "/sprint?id=" + id, sprint);
    }

}

