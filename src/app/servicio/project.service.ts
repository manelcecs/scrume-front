import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { ProjectDto, ProjectComplete } from '../dominio/project.domain';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})

export class ProjectService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    getProject(idProject : number) : Observable<ProjectDto>{
        
        return this.httpClient.get<ProjectDto>("/api/project/list?id=688", {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getProjectWithTasks(idProject : number):any{
        let project : ProjectComplete = {
            id: 1,
            name: "Acme-Madrugá",
            description: "Proyecto para la asignatura de Diseño y Pruebas 2. El objetivo es que los usuarios (hermandades de semana santa) puedan organizar sus cofradías y los hermanos puedan apuntarse. El A+ para este proyecto es la inclusión de un sistema de gráficos en el dashboard.",
            tasks:[
                {
                    id: 2,
                    title: 'Tarea 1',
                },
                {
                    id: 3,
                    title: 'Tarea 2',
                    estimate: 19,
                },
                {
                    id: 4,
                    title: 'Tarea 3',
                },
                {
                    id: 5,
                    title: 'Tarea 4',
                    estimate: 24,
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

    createProject(project: ProjectDto) : Observable<ProjectDto> {
        
        return this.httpClient.post<ProjectDto>(this.cabeceraService.getCabecera() +"api/project/save", project, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editProject(id: number, project : ProjectDto) : any {
        return this.httpClient.put<ProjectDto>(this.cabeceraService.getCabecera() + "api/project/update?id=" + id, project, {headers: this.cabeceraService.getBasicAuthentication()});
        
    }
      
    deleteProject(id: number):any {
        return this.httpClient.delete<ProjectDto>(this.cabeceraService.getCabecera() + "api/project/delete?id=" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getProjects(id: number): Observable<ProjectDto[]>{
        return this.httpClient.get<ProjectDto[]>("/api/project/list?id="+id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

}

