import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint } from '../dominio/sprint.domain';
import { TaskSimple, TaskDto } from '../dominio/task.domain';

@Injectable({providedIn:'root'})

export class TaskService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    createTask(task : TaskDto): Observable<TaskDto>{
      return this.httpClient.post<TaskDto>(this.cabeceraService.getCabecera() + "api/task/" + task.project.id, task, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editTask(id: number, task : TaskSimple): Observable<TaskSimple>{
     return this.httpClient.put<TaskSimple>(this.cabeceraService.getCabecera() + "api/task/" + id, task, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteTask(id: number): Observable<TaskSimple>{
     return this.httpClient.delete<TaskSimple>(this.cabeceraService.getCabecera() + "api/task/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

}
