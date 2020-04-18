import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TeamService } from "../servicio/team.service";
import { Team, TeamSimple } from "../dominio/team.domain";
import { FormControl, Validators } from "@angular/forms";
import { ProjectDto } from "../dominio/project.domain";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Member } from '../dominio/user.domain';
import { error } from '@angular/compiler/src/util';
import { UserService } from '../servicio/user.service';
import { UserLogged } from '../dominio/jwt.domain';
import { TouchSequence } from 'selenium-webdriver';





@Component({
  selector: "app-team-create",
  templateUrl: "./team-create.component.html",
  styleUrls: ["./team-create.component.css"]
})
export class TeamCreateComponent implements OnInit {

  members: Member[];
  displayedColumns: string[] = ['email', 'nickname', 'actions'];
  userLogged: UserLogged;
  numAdmins: number;

  constructor(
    private router: Router,
    private teamService: TeamService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  id: number;
  team: Team;

  name: FormControl = new FormControl("", {
    validators: [Validators.required, Validators.maxLength(15)]
  });

  private projects: ProjectDto[] = [];

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id != undefined) {
        this.id = params.id;

        this.teamService.getTeam(this.id).subscribe((team: Team) => {
          this.team = team;
          this.name.setValue(this.team.name);
          if (!this.team.isAdmin) {
            this.navigateTo("teams");
          }
        });
        this.teamService.getTeamMembers(this.id).subscribe((members : Member[]) => {
          this.members = members;
          this.numAdmins = members.filter((member: Member) => member.isAdmin).length
        });
        this.userLogged = this.userService.getUserLogged();
        console.log("Id logueado", this.userLogged.idUser);
      }
    });
  }

  validForm(): boolean {
    return this.name.valid;
  }

  createTeam(): void {
    if (this.validForm()) {
      if (this.id != undefined) {
        this._editTeam(this.id).subscribe(
          (resp: Team) => {
            this.team = resp;
            this.navigateTo("teams");
          },
          error => {
            this.snackBarError(
              "Se ha producido un error y no se ha podido editar el equipo"
            );
          }
        );
      } else {
        this._createTeam().subscribe(
          (resp: Team) => {
            this.team = resp;
            this.navigateTo("teams");
          },
          error => {
            this.snackBarError(
              "Se ha producido un error y no se ha podido guardar el equipo"
            );
          }
        );
      }
    }
  }

  private _editTeam(id: number): Observable<TeamSimple> {
    this.team.name = this.name.value;
    this.team.id = id;
    return this.teamService.editTeam(this.team);
  }

  private _createTeam(): Observable<TeamSimple> {
    //this.team = {name: this.name.value, projects: this.projects}
    this.team = { id: 0, name: this.name.value };
    return this.teamService.createTeam(this.team);
  }

  cancelCreateteam(): void {
    this.router.navigate(["teams"]);
  }

  getErrorMessageName(): String {
    return this.name.hasError("required")
      ? "Este campo es requerido."
      : this.name.hasError("maxlength")
      ? "Este campo no permite más de 15 caracteres."
      : "";
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private snackBarError(error: string): void {
    this._snackBar.open(error, "Cerrar", {
      duration: 2000
    });
  }

  changeRol(idMember: number, isAdmin: boolean): void{
    this.teamService.changeRol(this.team.id, idMember, !isAdmin).subscribe(() => {
      this.teamService.getTeamMembers(this.team.id).subscribe((members: Member[]) => {
        if (idMember == this.userLogged.idUser) {
          this.navigateTo("teams");
        } else {
          this.members = members;
          this.numAdmins = members.filter((member: Member) => member.isAdmin).length
        }
      })
    }, error => {
      this.snackBarError("No se ha podido cambiar el rol del usuario");
    });
  }

  deleteFromTeam(idMember: number): void{
    console.log("IdMember:", idMember, "IdLogged", this.userLogged.idUser);
    this.teamService.deleteFromTeam(this.team.id, idMember).subscribe(() => {
      if (idMember == this.userLogged.idUser) {
        this.navigateTo("teams");
      } else {
        this.teamService.getTeamMembers(this.team.id).subscribe((members: Member[]) => {
          this.members = members;
          this.numAdmins = members.filter((member: Member) => member.isAdmin).length
        })
      }
    }, error => {
      this.snackBarError("No se ha podido eliminar al usuario");
    });
  }
}
