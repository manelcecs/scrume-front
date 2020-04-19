import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../servicio/project.service';
import { ProjectDto, ProjectName } from '../dominio/project.domain';
import { SprintService } from '../servicio/sprint.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintDisplay, Sprint, SprintJsonDates } from '../dominio/sprint.domain';
import { FormControl, Validators, Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { NotificationAlert } from '../dominio/notification.domain';
import { AlertService } from '../servicio/alerts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidationService } from '../servicio/validation.service';

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css", "./new-sprint-dialog.css"],
})
export class ProjectComponent implements OnInit {

  project : ProjectDto;
  sprints : SprintDisplay[];
  startDate: Date;
  endDate: Date;
  validationCreate: boolean;
  validationCreateAlert: boolean;
  idTeam: number;

  idProject: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private sprintService: SprintService,
    public dialog: MatDialog,
    private validationService: ValidationService
  ) {
    this.project = this.activatedRoute.snapshot.data.project;
    this.sprints = this.activatedRoute.snapshot.data.sprints;
      this.updateValidatorCreate();
      this.validationService.checkCanDisplayCreateAlerts(this.project.team.id).subscribe((res: boolean) => {
        this.validationCreateAlert = res;
      });

    }

  ngOnInit(): void {}
  openBacklog(): void {
    this.router.navigate(["backlog"], { queryParams: { id: this.project.id } });
  }

  openTeam(team: number): void {
    this.router.navigate(["team"], { queryParams: { id: team } });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewSprintDialog, {
      width: '250px',
      data: {sprint: {project:{id:this.project.id, name:this.project.name},startDate: this.startDate, endDate: this.endDate}, validationAlerts: this.validationCreateAlert}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.sprintService.getSprintsOfProject(this.project.id).subscribe((sprint:SprintDisplay[])=>{
        this.sprints = sprint;
        this.updateValidatorCreate();
      });
    });
  }

  private updateValidatorCreate(): void {
    this.validationService.checkNumberOfSprints(this.project.team.id, this.sprints.length).subscribe((res: boolean) => {
      this.validationCreate = res;
    })
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  navigateToSprint(sprint: Sprint): void {
    this.router.navigate(["sprint"], { queryParams: { method:"get", id: sprint.id } });
  }

  editProject(project: ProjectDto) {
    this.router.navigate(["createProject"], {
      queryParams: { id: project.id, action: "edit" },
    });
  }

  deleteProject(idProject: number) {
    this.projectService
      .deleteProject(idProject)
      .subscribe((project: ProjectDto) => {
        this.navigateTo("teams");
      });
  }

  
}

export interface ExchangeData {
  sprint: Sprint;
  validationAlerts: boolean;
}
// DIALOGO PARA CREAR UN SPRINT
@Component({
  selector: "new-sprint-dialog",
  templateUrl: "new-sprint-dialog.html",
  styleUrls: ["./new-sprint-dialog.css"],
})
export class NewSprintDialog implements OnInit {
  idSprintSaved: number;
  project: ProjectName;
  sprint: SprintJsonDates;
  startDate = new FormControl('',  { validators: [Validators.required]});
  endDate = new FormControl('',  { validators: [Validators.required] });
  validationCreateAlert:boolean;
  loading: boolean = false;

  //alertas de sprint
  alertDate = new FormControl("");
  alertTitle = new FormControl("");

  alerts: NotificationAlert[] = [];

  constructor(
    public dialogRef: MatDialogRef<NewSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ExchangeData,
    private sprintService: SprintService,
    private router: Router,
    private alertService: AlertService,
    private snackBar: MatSnackBar,
    private validationService: ValidationService) {}

  ngOnInit(): void {
    this.project = this.data.sprint.project;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.validForm()) {
      this.loading = true;
      this.sprint = {
        id: 0,
        startDate: new Date(this.startDate.value).toISOString(),
        endDate: new Date(this.endDate.value).toISOString(),
        project: { id: this.project.id, name: this.project.name },
      };

      this.sprintService.createSprint(this.sprint).subscribe(
        (sprint: Sprint) => {
          this.idSprintSaved = sprint.id;
        },
        (error) => {
          this.openSnackBar(
            "Ha ocurrido un error al crear el Sprint.",
            "Cerrar",
            true
          );
        },
        () => {
          if (this.alerts.length > 0) {
            //llamada a crear alertas
            for (let alert of this.alerts) {
              alert.sprint = this.idSprintSaved;
              this.alertService.crateAlert(alert).subscribe(
                () => { },
                (error) => {
                  this.loading = false;
                  this.openSnackBar(
                    "Ha ocurrido un error al crear las alertas. Intentelo de nuevo en el panel del proyecto.",
                    "Cerrar",
                    false
                  );
                }
              );
            }
            this.loading = false;
            this.openSnackBar(
              "El sprint y las alertas se han creado correctamente.",
              "Cerrar",
              false
            );
          } else {
            this.loading = false;
            this.openSnackBar(
              "El sprint se ha creado correctamente.",
              "Cerrar",
              false
            );
          }
        }
      );
    }
  }

  getErrorMessageStartDate(): string {
    return this.startDate.hasError("required")
      ? "Este campo es obligatorio"
      : this.startDate.hasError("past")
        ? "La fecha no puede ser en pasado"
        : this.startDate.hasError("invalid")
          ? "La fecha de fin no puede ser anterior a la de inicio"
          : this.startDate.hasError("usedDates")
            ? "Ya hay un sprint en las fechas seleccionadas"
            : this.startDate.hasError("beforeToday")
              ? "La fecha no puede ser anterior a hoy"
              : "";
  }

  getErrorMessageEndDate(): string {
    return this.endDate.hasError("required")
      ? "Este campo es obligatorio"
      : this.endDate.hasError("past")
        ? "La fecha no puede ser en pasado"
        : this.endDate.hasError("usedDates")
          ? "Ya hay un sprint en las fechas seleccionadas"
          : this.endDate.hasError("beforeTodayEnd")
            ? "La fecha no puede ser anterior a hoy"
            : "";
  }

  validForm(): boolean {
    let valid: boolean;

    valid = this.endDate.valid && this.startDate.valid;
    return valid;
  }

  beforeTodayDateValidator(date: FormControl) {
    let formControlToTime: number = new Date(date.value).getTime();
    let today: Date = new Date();
    let tomorrowTime: number = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0, 0, 0).getTime();
    if (formControlToTime < tomorrowTime) {
      date.setErrors({ beforeToday: true });
    } else {
      date.updateValueAndValidity();
    }
  }

  validDatesValidator() {
    if (this.endDate.value != '' && this.startDate.value != '') {
      this.sprintService
      .checkDates(this.project.id, this.startDate.value, this.endDate.value)
      .subscribe((res: boolean) => {
        if (!res) {
          this.startDate.setErrors({ usedDates: true });
          this.endDate.setErrors({ usedDates: true });
        } else if (
          !(
            this.startDate.hasError("beforeToday") ||
            this.endDate.hasError("beforeTodayEnd")
            )
            ) {
              this.startDate.updateValueAndValidity();
              this.endDate.updateValueAndValidity();
            }
          });
    }

  }

  //Alert Notificacion
  addAlert(): void {
    let alert: NotificationAlert;

    alert = {
      date: new Date(this.alertDate.value),
      title: this.alertTitle.value,
    };
    this.alerts.push(alert);

    this.alertDate.setValue("");
    this.alertTitle.setValue("");
  }

  remove(alert: NotificationAlert): void {
    let index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  allowAdd(): boolean {
    let allow: boolean = true;

    //las fechas de inicio y fin del sprint están rellenas y válidas
    allow = allow && this.validForm();

    //Están rellenos pero no requeridos
    allow = allow && this.alertTitle.value != "";
    allow = allow && this.alertDate.value != "";
    //Son válidos
    allow = allow && this.alertDate.valid;

    return allow;
  }

  validDateInSprint(date: FormControl) {
    let startDate = new Date(this.startDate.value).getTime();
    let endDate = new Date(this.endDate.value).getTime();

    let alertDate = new Date(date.value).getTime();
    //Para controlar hoy hasta las 23:59
    alertDate = alertDate + 86340000;

    if (startDate > alertDate) {
      this.alertDate.setErrors({ betweenSprint: true });
    } else if (alertDate > endDate) {
      this.alertDate.setErrors({ betweenSprint: true });
    } else {
      this.alertDate.updateValueAndValidity();
    }
  }

  getErrorMessageAlertDate(): string {
    return this.alertDate.hasError("beforeToday")
      ? "La fecha seleccionada no puede ser anterior a la fecha actual"
      : this.alertDate.hasError("betweenSprint")
        ? "La fecha de la alerta debe estar dentro del Sprint"
        : "";
  }

  openSnackBar(message: string, action: string, error: boolean) {
    if (error) {
      this.snackBar.open(message, action, {
        duration: 2000,
      });
    } else {
      this.snackBar
        .open(message, action, {
          duration: 2000,
        })
        .afterDismissed()
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }
}
