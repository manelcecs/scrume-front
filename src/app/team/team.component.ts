import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Team } from '../dominio/team.domain';
import { Router } from '@angular/router';
import { TeamService } from '../servicio/team.service';
import { ProjectDto } from '../dominio/project.domain';
import { Board } from '../dominio/board.domain';
import { Sprint, SprintDisplay } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';
import { ProjectService } from '../servicio/project.service';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvitationDto } from '../dominio/invitation.domain';
import { FormControl, Validators } from '@angular/forms';
import { UserNick } from '../dominio/user.domain';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { InvitationService } from '../servicio/invitation.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  options = {
    autoClose: true,
    keepAfterRouteChange: true
};
  teams: Team[];

  constructor(private router: Router,
    private teamService: TeamService,
    private sprintService: SprintService,
    private projectService: ProjectService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.teamService.getAllTeams().subscribe((teams : Team[] )=>{
      this.teams = teams;
      for(let t of this.teams){
        this.getProjectsOfTeam(t.id).subscribe((projects: ProjectDto[]) =>{
          t.projects = projects;
          console.log("Asignados los proyectos "+projects+" al equipo "+t.name);
        });
      }
    }, (error)=>{
      console.log("Error al hacer la petición a BD. "+error);
      //error("Error al hacer la petición a BD.", this.options);
    });
    }; //añadir subscribe((teams:IPaginationPage<Teams>)=>{this.teams = teams});


  createTeam(): void {
    this.router.navigate(['teamsCreate']);
  }

  editTeam(row: Team): void{
    this.router.navigate(['teamsCreate'], {queryParams: {id: row.id}});
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  openProject(proj: ProjectDto): void{
    console.log(JSON.stringify(proj));
    this.router.navigate(['project'], {queryParams: {id: proj.id}});
  }

  createProject(team: Team): void{
    this.router.navigate(['createProject'], {queryParams: {id: team.id, action: "create"}});
  }

  openBoard(proj: ProjectDto): void{
    this.router.navigate(['project'], {queryParams: {id: proj.id}});
  }

  openSprint(proj: ProjectDto): void{
    let idSprint : number;
    this.sprintService.getSprintsOfProject(proj.id).subscribe((sprints: SprintDisplay[])=>{
      idSprint = sprints[sprints.length-1].id;
      this.router.navigate(['sprint'], {queryParams:{id : idSprint}});
    });
  }

  getProjectsOfTeam(id: number): Observable<ProjectDto[]>{
    return this.projectService.getProjectsByTeam(id);
  }

  deleteTeam(idTeam : number): void {
    this.teamService.deleteTeam(idTeam).subscribe(() => {
      this.teamService.getAllTeams().subscribe((teams : Team[] )=>{
        this.teams = teams;
        for(let t of this.teams){
            this.getProjectsOfTeam(t.id).subscribe((projects: ProjectDto[]) =>{
            t.projects = projects;
          });
        }
      });
    });
  }

  openDialogInvite(idTeam: number): void {
    this.dialog.open(InvitationDialog, {
      width: '250px',
      data: idTeam
    });
  }
}


@Component({
  selector: 'invite-dialog',
  templateUrl: 'invite-dialog.html',
  styleUrls: ['./invite-dialog.css']
})
export class InvitationDialog implements OnInit{

  team: number;
  invitation : InvitationDto;
  users : number[];
  usersBD : UserNick[];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  message = new FormControl('',  { validators: [Validators.required]});
  messageFormControl = new FormControl('', {validators: [Validators.required]});
  userFormControl = new FormControl('',  { validators: [Validators.required]});
  suggestedUsers : Observable<UserNick[]>;

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<InvitationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: number, private invitationService : InvitationService) {

    }


  ngOnInit(): void {
    this.team = this.data;
    this.invitationService.getSuggestedUsers(this.team).subscribe((users : UserNick[]) =>{
      this.usersBD = users;
      console.log(this.usersBD);
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  remove(user: number): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    this.users.push(parseInt(value));
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.userFormControl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(parseInt(event.option.viewValue));
    this.userInput.nativeElement.value = '';
    this.userFormControl.setValue(null);
  }

  onSaveClick() : void {
    let invitation : InvitationDto= {message: this.messageFormControl.value, team: this.team, recipients: Array(this.userFormControl.value)};
    this.invitationService.createInvitation(invitation).subscribe(() => {
      this.dialogRef.close();
    });

  }

  // getErrorMessageStartDate() : string {
  //   return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':this.startDate.hasError('invalid')?'La fecha de fin no puede ser anterior a la de inicio':'';
  // };

  // getErrorMessageEndDate() : string {
  //   return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':'';
  // }

  validForm():boolean {

     let valid: boolean;

     valid = this.messageFormControl.valid && this.userFormControl.valid;
     return valid;

   }

  // validateToday(): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any} | null => {
  //     console.log("Prueba 2")
  //     let isValid = true;

  //     if (control.value.getTime() < Date.now()) {
  //       isValid = false;
  //     }
  //     return isValid ? null : { 'past': 'the date cant be past' }
  //   };
  // }

  // validateStartBeforeEnd(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //     let isValid = true;
  //     if (control.value.getTime() > this.endDate.value.getTime()) {
  //       isValid = false;
  //     }
  //     return isValid ? null : { 'invalid': 'Invalid dates' }

  //   };
  // }

}
