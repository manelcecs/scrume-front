import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabeceraService } from './cabecera.service';
import { Observable } from 'rxjs';
import { ProjectDto, ProjectComplete } from '../dominio/project.domain';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({providedIn:'root'})

export class ProjectService {

    constructor(private httpClient:HttpClient, private cabeceraService:CabeceraService){}

    

    createProject(project: ProjectDto) : Observable<ProjectDto> {
        return this.httpClient.post<ProjectDto>(this.cabeceraService.getCabecera() + "api/project", project, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    editProject(id: number, project : ProjectDto) : Observable<ProjectDto> {
        return this.httpClient.put<ProjectDto>(this.cabeceraService.getCabecera() + "api/project/" + id, project, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    deleteProject(id: number): Observable<ProjectDto> {
        return this.httpClient.delete<ProjectDto>(this.cabeceraService.getCabecera() + "api/project/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getProject(id : number) : Observable<ProjectDto>{
        return this.httpClient.get<ProjectDto>(this.cabeceraService.getCabecera() + "api/project/" + id, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getProjectsByTeam(idTeam: number): Observable<ProjectDto[]>{
        return this.httpClient.get<ProjectDto[]>(this.cabeceraService.getCabecera() + "api/project/list/" + idTeam, {headers: this.cabeceraService.getBasicAuthentication()});
    }

    getProjectWithTasks(idProject : number): Observable<ProjectComplete>{
      return this.httpClient.get<ProjectComplete>(this.cabeceraService.getCabecera() + "api/task/list-by-project/" + idProject, {headers: this.cabeceraService.getBasicAuthentication()});
  }
}

@Injectable({providedIn:'root'})

export class ProjectResolverService implements Resolve<any>{

    constructor(private projectService: ProjectService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){

            return this.projectService.getProject(activatedRoute.queryParams.idProject);
    }
}

@Injectable({providedIn:'root'})

export class ProjectWithTaskResolverService implements Resolve<any>{

    constructor(private projectService: ProjectService){

    }

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        
        return this.projectService.getProjectWithTasks(activatedRoute.queryParams.idProject);
    }
}
