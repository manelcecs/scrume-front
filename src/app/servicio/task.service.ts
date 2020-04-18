import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { TaskSimple, TaskDto, TaskMove, TaskEstimate, TaskToList } from '../dominio/task.domain';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({providedIn:'root'})

export class TaskService {

  
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    createTask(idProyect:number, task : TaskSimple): Observable<TaskSimple>{
      return this.httpClient.post<TaskSimple>(this.cabeceraService.getCabecera() + "api/task/" + idProyect, task, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editTask(id: number, task : TaskSimple): Observable<TaskSimple>{
     return this.httpClient.put<TaskSimple>(this.cabeceraService.getCabecera() + "api/task/" + id, task, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteTask(id: number): Observable<TaskSimple>{
     return this.httpClient.delete<TaskSimple>(this.cabeceraService.getCabecera() + "api/task/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    moveTask(task: TaskMove): Observable<TaskMove> {
      return this.httpClient.post<TaskMove>(this.cabeceraService.getCabecera() + "api/history-task/move", task, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    estimateTask(taskEstimate: TaskEstimate):Observable<TaskEstimate>{
      return this.httpClient.post<TaskEstimate>(this.cabeceraService.getCabecera() +  "api/task/estimate/" + taskEstimate.task, taskEstimate, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getTask(idTask: number): Observable<TaskDto> {
      return this.httpClient.get<TaskDto>(this.cabeceraService.getCabecera() + "api/task/"+idTask, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getTasksOfUser(){
      return this.httpClient.get<TaskToList>(this.cabeceraService.getCabecera()+"api/task/user/", {headers: this.cabeceraService.getBasicAuthentication()});
    }

}

@Injectable({providedIn: 'root'})
export class TaskResolverService implements Resolve<any>{

    constructor(private task: TaskService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        
        //let method = activatedRoute.queryParams.method;
        return this.task.getTasksOfUser();
    }
}

