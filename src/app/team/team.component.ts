import { Component, OnInit, Inject, ElementRef, ViewChild, Injectable } from '@angular/core';
import { Team } from '../dominio/team.domain';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from '../servicio/team.service';
import { ProjectDto } from '../dominio/project.domain';
import { BoardSimple } from '../dominio/board.domain';
import { SprintDisplay } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';
import { ProjectService } from '../servicio/project.service';
import { Observable } from 'rxjs';
import { BoardService } from '../servicio/board.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvitationDto } from '../dominio/invitation.domain';
import { FormControl, Validators } from '@angular/forms';
import { UserNick } from '../dominio/user.domain';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { InvitationService } from '../servicio/invitation.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidationService } from '../servicio/validation.service';


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
  boardNumber: number;
  validationCreateTeam: {[key: number] : boolean} = {};

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private sprintService: SprintService,
    private projectService: ProjectService,
    private boardService: BoardService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar, private validationService: ValidationService
  ) {

    this.teams = this.activatedRoute.snapshot.data.teams;
    for (let t of this.teams) {
      this.getProjectsOfTeam(t.id).subscribe((projects: ProjectDto[]) => {
        t.projects = projects;
        this.validationService.checkNumberOfProjects(t.id, projects.length).subscribe((res: boolean) => {
          this.validationCreateTeam[t.id] = res;
        })
      }, (error) => {
      });
    }
  }

  ngOnInit(): void {
  }

  //-----------------

  createTeam(): void {
    this.router.navigate(['teamsCreate']);
  }

  editTeam(row: Team): void {
    this.router.navigate(['teamsCreate'], { queryParams: { id: row.id } });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openProject(proj: ProjectDto): void {
    this.router.navigate(['project'], { queryParams: { method: "list", id: proj.id } });
  }

  createProject(team: Team): void {
    this.router.navigate(['createProject'], { queryParams: { id: team.id, action: "create" } });
  }

  openBoard(idProj: number): void {
    this.boardService.getBoardByProject(idProj).subscribe((board: BoardSimple) => {
      this.boardNumber = board.id;
      if (this.boardNumber != 0) {
        this.router.navigate(['board'], { queryParams: { id: this.boardNumber } });
      } else {
        this._snackBar.open("No hay un tablero actualizado recientemente", "Cerrar", {
          duration: 5000,
        });
      }
    });
  }

  openSprint(proj: ProjectDto): void {
    let idSprint: number;
    this.sprintService.getSprintsOfProject(proj.id).subscribe((sprints: SprintDisplay[]) => {
      if (sprints.length != 0) {
        idSprint = sprints[sprints.length - 1].id;
        this.router.navigate(['sprint'], { queryParams: { method: "get", id: idSprint } });
      } else {
        this._snackBar.open("No hay ningún sprint", "Cerrar", {
          duration: 5000,
        });
      }
    });
  }

  getProjectsOfTeam(id: number): Observable<ProjectDto[]> {
    return this.projectService.getProjectsByTeam(id);
  }

  deleteTeam(idTeam: number): void {
    this.teamService.deleteTeam(idTeam).subscribe(() => {
      this.teamService.getAllTeams().subscribe((teams: Team[]) => {
        this.teams = teams;
        for (let t of this.teams) {
          this.getProjectsOfTeam(t.id).subscribe((projects: ProjectDto[]) => {
            t.projects = projects;
          });
        }
      });
    });
  }

  leaveTeam(idTeam: number): void {
    this.teamService.leaveTeam(idTeam).subscribe(() => {
      this.teamService.getAllTeams().subscribe((teams: Team[]) => {
        this.teams = teams;
        for (let t of this.teams) {
          this.getProjectsOfTeam(t.id).subscribe((projects: ProjectDto[]) => {
            t.projects = projects;
          });
        }
      });
    }, error => {
      this._snackBar.open(
        "Se ha producido un error en el servidor", "Cerrar", {
        duration: 2000
      }
      )
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
export class InvitationDialog implements OnInit {

  team: number;
  invitation: InvitationDto;
  //users : number[];
  usersBD: UserNick[];
  searchValue;
  messageFormControl = new FormControl('', { validators: [Validators.required] });
  // suggestedUsers : Observable<UserNick[]>;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  usersCtrl = new FormControl('', { validators: [Validators.required] });
  filteredUsers: Observable<UserNick[]>;
  users: UserNick[] = [];
  allUsers: UserNick[] = [];

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<InvitationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: number, private invitationService: InvitationService, public snackbar: MatSnackBar) {
    this.team = this.data;
    this.invitationService.getSuggestedUsers(this.team, [], "").subscribe((res: UserNick[]) => {
      this.allUsers = res;
      this.usersCtrl.valueChanges.subscribe(() => {
        this.filteredUsers = this.invitationService.getSuggestedUsers(this.team, this.users, this.usersCtrl.value);
        });
      });
    }


  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.users.push();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.usersCtrl.setValue(null);
  }

  remove(user: UserNick): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.value);
    this.userInput.nativeElement.value = '';
    this.usersCtrl.setValue(null);
  }

  private _filter(value: string): UserNick[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(user => user.nick.toLowerCase().startsWith(filterValue));
  }

  onSaveClick(): void {
    let recipients: number[] = [];
    this.users.forEach(user => recipients.push(user.id));
    let invitation: InvitationDto = { message: this.messageFormControl.value, team: this.team, recipients: recipients };
    this.invitationService.createInvitation(invitation).subscribe(() => {
      this.dialogRef.close();
    }, (error) => {
      this.snackbar.open("Se ha producido un error al mandar la invitación", "Cerrar", {
        duration: 3000
      })
    });
  }

  getErrorMessageMessage(): string {
    return this.messageFormControl.hasError('required') ? 'El mensaje es obligatorio' : '';
  }


  validForm(): boolean {
    let valid: boolean;
    valid = this.messageFormControl.valid && this.users.length != 0;
    return valid;
  }


}
