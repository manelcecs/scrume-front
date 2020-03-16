import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { SprintDisplay, Sprint } from '../dominio/sprint.domain';
import { Task } from '../dominio/task.domain';

@Injectable({providedIn:'root'})

export class TaskService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    createTask(task : Task){
      let task1 : Task;
      task1 = {id : 1, name: task.name};

      let response = new Observable(obs => {
          setTimeout(() => {
              obs.next(task1);
          }, 1000);
      });

      return response;
    }

    editTask(id: number, task : Task) : any {
      // return this.httpClient.post<Sprint>(this.cabeceraService.getCabecera() + "/task?id=" + id, task);
      let response = new Observable(obs => {
          setTimeout(() => {
              obs.next(task);
          }, 1000);
      });

      return response;
    }

    deleteSprint(id: number):any {
      // return this.httpClient.post<Sprint>(this.cabeceraService.getCabecera() + "/task?id=" + id, task);
    }

}

