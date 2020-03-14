import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { ProjectDto } from '../dominio/project.domain';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';

@Injectable({providedIn:'root'})

export class ProjectService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getProject(idProject : number) /*: Observable<ProjectDto>*/{
        // return this.httpClient.get<Team>(this.cabeceraService.getCabecera() + "/project");
        let project : ProjectDto = {
            id: 1,
            name: "Acme-Madrugá",
            description: "Proyecto para la asignatura de Diseño y Pruebas 2. El objetivo es que los usuarios (hermandades de semana santa) puedan organizar sus cofradías y los hermanos puedan apuntarse. El A+ para este proyecto es la inclusión de un sistema de gráficos en el dashboard.",
            equipo: 1
          }
        return project;
    }

    createProject(project: ProjectDto) : any {
        // return this.httpClient.post<ProjectDto>(this.cabeceraService.getCabecera() + "/project/create", project);
        let project1 : ProjectDto;
        project1 = {id : 1, name : project.name, description : project.description, equipo: project.equipo};

        let response = new Observable(obs => {
            setTimeout(() => {
                obs.next(project1);
            }, 1000);
        });

        return response;
    }

    editProject(id: number, project : ProjectDto) : any {
        // return this.httpClient.post<ProjectDto>(this.cabeceraService.getCabecera() + "/project?id=" + id, project);
        let response = new Observable(obs => {
            setTimeout(() => {
                obs.next(project);
            }, 1000);
        });

        return response;
      }

      deleteProject(id: number):any {
      //   // return this.httpClient.post<ProjectDto>(this.cabeceraService.getCabecera() + "/project?id=" + id, project);
      }



}

