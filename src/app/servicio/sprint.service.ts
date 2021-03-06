import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint, SprintJsonDates, SprintWorkspace } from '../dominio/sprint.domain';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({providedIn:'root'})

export class SprintService {


    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    createSprint(sprint : SprintJsonDates) : Observable<Sprint>{
      return this.httpClient.post<Sprint>(this.cabeceraService.getCabecera() + "api/sprint", sprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editSprint(id: number, sprint : SprintJsonDates) : Observable<Sprint> {
      return this.httpClient.put<Sprint>(this.cabeceraService.getCabecera() + "api/sprint/" + id, sprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteSprint(id: number):any {
      // return this.httpClient.post<Sprint>(this.cabeceraService.getCabecera() + "/sprint?id=" + id, sprint);
    }

    getSprint(idSprint : number): Observable<SprintDisplay>{
      return this.httpClient.get<SprintDisplay>(this.cabeceraService.getCabecera() + "api/sprint/" + idSprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getSprintsOfProject(idProject : number): Observable<SprintDisplay[]>{
      return this.httpClient.get<SprintDisplay[]>(this.cabeceraService.getCabecera() + "api/sprint/list/" + idProject, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    listTodoColumnsOfAProject(idProject: number): Observable<SprintWorkspace[]> {
      return this.httpClient.get<SprintWorkspace[]>(this.cabeceraService.getCabecera() + "api/workspace/list-todo-columns/" + idProject, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    checkDates(project : number, starDate: Date, endDate : Date) : Observable<boolean>{
      let data= {"startDate": starDate.toISOString(), "endDate": endDate.toISOString()};
      console.log("Checking dates:", data);
      return this.httpClient.post<boolean>(this.cabeceraService.getCabecera() + "api/sprint/check-dates/" + project, data, {headers: this.cabeceraService.getBasicAuthentication()});
    }
}


@Injectable({providedIn:'root'})
export class SprintWorkspaceResolverService implements Resolve<any>{

    constructor(private sprintService: SprintService){
    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        console.log("Iniciando el resolver: Sprints");
        return this.sprintService.listTodoColumnsOfAProject(activatedRoute.queryParams.id);
    }
}

@Injectable({providedIn: 'root'})
export class SprintResolverService implements Resolve<any>{

    constructor(private sprintService: SprintService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        console.log("Iniciando el resolver");
        return this.sprintService.getSprintsOfProject(activatedRoute.queryParams.id);
    }
}
