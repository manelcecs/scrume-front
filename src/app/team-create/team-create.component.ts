import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from '../servicio/team.service';
import { Team, TeamSimple } from '../dominio/team.domain';
import { FormControl, Validators } from '@angular/forms';
import { ProjectDto } from '../dominio/project.domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit {

  constructor(private router: Router, private teamService: TeamService, private activatedRoute: ActivatedRoute) {}

  private id: number;
  team: Team;

  name: FormControl = new FormControl('',{validators: [Validators.required, Validators.maxLength(15)]});

  private projects: ProjectDto[] = [];

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {

      if (params.id != undefined){
        this.id = params.id;

        this.teamService.getAllTeams().subscribe((teams: Team[])=>{
          this.team = teams.find((team: Team)=>{
            if(team.id == this.id){
              return team;
            }
          });

          this.name.setValue(this.team.name);

          this.projects = this.team.projects;
        });

      }

    });

  }

  validForm():boolean {

    let valid: boolean = true;

    valid = valid && this.name.valid;
    return valid;

  }

  createTeam(): void {
    if (this.validForm()){
      if (this.id != undefined){

        this._editTeam(this.id).subscribe((resp: Team) => {

          this.team = resp;
          this.navigateTo("teams");
        });

      }else{

        this._createTeam().subscribe((resp: Team) => {

          this.team = resp;
          this.navigateTo("teams");
        },(error) => {
          this.team = undefined;
        });
      }
    }


  }


  private _editTeam(id: number):Observable<TeamSimple>{
    this.team.name = this.name.value;
    this.team.id = id;
    return this.teamService.editTeam(this.team);

  }

  private _createTeam():Observable<TeamSimple>{
    //this.team = {name: this.name.value, projects: this.projects}
    this.team = {id:0, name: this.name.value}
    return this.teamService.createTeam(this.team);
  }

  cancelCreateteam(): void {

    this.router.navigate(['teams']);

  }

  getErrorMessageName(): String {
    return this.name.hasError('required')?'Este campo es requerido.':this.name.hasError('maxlength')?'Este campo no permite más de 15 caracteres.':'';

  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

}
