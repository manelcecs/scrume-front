import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../servicio/project.service';
import { ProjectDto } from '../dominio/project.domain';
import { Sprint } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project : ProjectDto;
  sprints : Sprint[];

  constructor(
     private router: Router,
     private projectService: ProjectService, 
     private sprintService : SprintService
    ) { }

  ngOnInit(): void {
    this.projectService.getProject(0).subscribe((project:ProjectDto)=>{
        this.project = project;
        console.log(JSON.stringify(this.project));
        this.sprints = this.sprintService.getSprintsOfProject(0);
        console.log("Init " + this.project.id);
    });

  }

  openBacklog(): void{
    console.log("openBacklog" + this.project.id);
    this.router.navigate(['backlog'], {queryParams: {id: this.project.id}});
  }

}
