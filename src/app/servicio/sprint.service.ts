import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint, SprintJsonDates, SprintWorkspace } from '../dominio/sprint.domain';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BurnDownDisplay, BurnUpDisplay } from '../dominio/burn.domain';

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
      return this.httpClient.post<boolean>(this.cabeceraService.getCabecera() + "api/sprint/check-dates/" + project, data, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getBurnDown(idSprint : number): Observable<BurnDownDisplay[]>{
      return this.httpClient.get<BurnDownDisplay[]>(this.cabeceraService.getCabecera() + "api/sprint/burndown/" + idSprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getBurnUp(idSprint : number): Observable<BurnUpDisplay[]>{
      return this.httpClient.get<BurnUpDisplay[]>(this.cabeceraService.getCabecera() + "api/sprint/burnup/" + idSprint, {headers: this.cabeceraService.getBasicAuthentication()});
    }
}


@Injectable({providedIn:'root'})
export class SprintWorkspaceResolverService implements Resolve<any>{

    constructor(private sprintService: SprintService){
    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.sprintService.listTodoColumnsOfAProject(activatedRoute.queryParams.idProject);
    }
}

@Injectable({providedIn: 'root'})
export class SprintResolverService implements Resolve<any>{

    constructor(private sprintService: SprintService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        let method = activatedRoute.queryParams.method;

        if(method == "list"){
          
          let id = activatedRoute.queryParams.idProject;
          return this.sprintService.getSprintsOfProject(id);
        }else if(method == "get"){
          
          let id = activatedRoute.queryParams.idSprint;
          return this.sprintService.getSprint(id);
        }
        
    }
}
