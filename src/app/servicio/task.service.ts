import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint } from '../dominio/sprint.domain';
import { TaskSimple, TaskDto } from '../dominio/task.domain';
import { Board } from '../dominio/board.domain';

@Injectable({providedIn:'root'})

export class TaskService {

  
    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    moveTaskToSprint(idColumn: number, idTask: number): Observable<TaskSimple>{
      console.log("Esta tarea " + idTask + "se mueve a " + idColumn);
      return this.httpClient.post<TaskSimple>(this.cabeceraService.getCabecera() + "api/history-task/move" + {"destiny": idColumn, "task": idTask}, {headers: this.cabeceraService.getBasicAuthentication()}); 
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

}
