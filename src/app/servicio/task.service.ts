import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint } from '../dominio/sprint.domain';
import { TaskSimple, TaskDto, TaskMove } from '../dominio/task.domain';
import { Board } from '../dominio/board.domain';

@Injectable({providedIn:'root'})

export class TaskService {

  
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    moveTaskToSprint(taskMove: TaskMove): Observable<TaskMove>{
      return this.httpClient.post<TaskMove>(this.cabeceraService.getCabecera() + "api/history-task/move", taskMove, {headers: this.cabeceraService.getBasicAuthentication()}); 
    }

    createTask(idProyect:number, task : TaskSimple): Observable<TaskSimple>{
      console.log("Tarea:" + JSON.stringify(task));
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

}
