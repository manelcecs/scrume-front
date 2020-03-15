import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { ProjectDto, ProjectComplete } from '../dominio/project.domain';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';

@Injectable({providedIn:'root'})

export class ProjectService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getProject(idProject : number):any{
        let project : ProjectDto = {
            id: 1,
            team: 2,
            name: "Acme-Madrugá",
            description: "Proyecto para la asignatura de Diseño y Pruebas 2. El objetivo es que los usuarios (hermandades de semana santa) puedan organizar sus cofradías y los hermanos puedan apuntarse. El A+ para este proyecto es la inclusión de un sistema de gráficos en el dashboard.",
        }
        let response = new Observable(obs => {

            setTimeout(() => {

                obs.next(project);

            }, 1000);

        });
        return response;
    }

    getProjectWithTasks(idProject : number):any{
        let project : ProjectComplete = {
            id: 1,
            name: "Acme-Madrugá",
            description: "Proyecto para la asignatura de Diseño y Pruebas 2. El objetivo es que los usuarios (hermandades de semana santa) puedan organizar sus cofradías y los hermanos puedan apuntarse. El A+ para este proyecto es la inclusión de un sistema de gráficos en el dashboard.",
            tasks:[
                {
                    id: 2,
                    name: 'Tarea 1'
                },
                {
                    id: 3,
                    name: 'Tarea 2',
                    estimate: 19
                },
                {
                    id: 4,
                    name: 'Tarea 3',
                },
                {
                    id: 5,
                    name: 'Tarea 4',
                    estimate: 24
                },
            ]
        }
        let response = new Observable(obs => {

            setTimeout(() => {

                obs.next(project);

            }, 1000);

        });
        return response;
    }

    createProject(project: ProjectDto) : any {
        // return this.httpClient.post<ProjectDto>(this.cabeceraService.getCabecera() + "/project/create", project);
        let project1 : ProjectDto;
        project1 = {id : 1, name : project.name, description : project.description, team: project.team};

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

