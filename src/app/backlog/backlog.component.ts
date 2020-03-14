import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BacklogService } from '../servicio/backlog.service';
import { Team } from '../dominio/team.domain';
import { ProjectDto } from '../dominio/project.domain';
import { ProjectService } from '../servicio/project.service';
import { TeamService } from '../servicio/team.service';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {

  idProject: number;
  team: Team;
  project: ProjectDto;

  constructor(private router: Router, private backlogService: BacklogService, private activatedRoute: ActivatedRoute,
    private projectService: ProjectService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {

      if(param.id != undefined){
        this.idProject = param.id;

        this.teamService.getTeamByProjectID(this.idProject).subscribe((team:Team)=>{

          this.team = team;
          
          this.projectService.getProject(this.idProject).subscribe((project:ProjectDto)=>{
            this.project = project;
          });

        });


      } else{
        this.navigateTo("bienvenida");
      }

    });
  }

  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  openProject(proj: ProjectDto): void{
    this.router.navigate(['project'], {queryParams: {id: proj.id}});
  }

  openTeam(team: Team): void{
    this.router.navigate(['team'], {queryParams: {id: team.id}});
  }

}
