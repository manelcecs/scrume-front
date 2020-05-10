import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectComplete, ProjectName } from '../dominio/project.domain';
import { ProjectService } from '../servicio/project.service';
import { TeamService } from '../servicio/team.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDto, TaskSimple, TaskMove, TaskEstimate } from '../dominio/task.domain';
import { FormControl, Validators } from '@angular/forms';
import { TaskService } from '../servicio/task.service';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { SprintWorkspace, SprintDisplay } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation/confirmation.component';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {

  idProject: number;
  project: ProjectComplete;
  sprints: SprintWorkspace[];
  compruebaBorrar: boolean;
  searchValue;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private projectService: ProjectService, private teamService: TeamService, private dialog: MatDialog,
    private taskService: TaskService, private bottomSheet: MatBottomSheet, private _snackBar: MatSnackBar) {

    this.idProject = this.activatedRoute.snapshot.data.project.id;
    this.project = this.activatedRoute.snapshot.data.project;
    this.sprints = this.activatedRoute.snapshot.data.sprints;
  }

  ngOnInit(): void {
    this.teamService.isAdminByTeam(this.project.team.id).subscribe((bol: boolean) => {
      this.compruebaBorrar = bol;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openProject(): void {
    this.router.navigate(['project'], { queryParams: { method: "list", idProject: this.project.id } });
  }

  openTeam(): void {
    this.router.navigate(['team'], { queryParams: { id: this.project.team.id } });
  }

  openSelectSprint(idTask: number): void {
    this.bottomSheet.open(SelectSprintBottomSheet,
      {
        data: { "idTask": idTask, "sprints": this.sprints }
      }
    ).afterDismissed().subscribe(() => {
      this.projectService.getProjectWithTasks(this.idProject).subscribe((project: ProjectComplete) => {
        this.project.tasks = project.tasks;
      });
    });
  }

  deleteTask(task: TaskSimple): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "250px",
      data: "Se procede a borrar la tarea. Esta acción es irreversible."
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.taskService.deleteTask(task.id).subscribe(() => {
          this.projectService.getProjectWithTasks(this.idProject).subscribe((project: ProjectComplete) => {
            this.project.tasks = project.tasks;
          });
        }, (error) => {
          this.openSnackBar(
            "Para borrar una tarea debes de ser el administrador del equipo.",
            "Cerrar",
            true
          );
        },
          () => {
            this.openSnackBar(
              "Se ha borrado correctamente.",
              "Cerrar",
              false
            );
          }
        );
      }
    });


  }

  openSnackBar(message: string, action: string, error: boolean) {
    if (error) {
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    } else {
      this._snackBar
        .open(message, action, {
          duration: 2000,
        })
        .afterDismissed()
        .subscribe(() => {
        });
    }
  }

  openCreateTask(): void {
    const dialogCreate = this.dialog.open(NewTaskDialog, {
      width: '250px',
      data: this.project
    });
    dialogCreate.afterClosed().subscribe((task: TaskSimple) => {
      this.projectService.getProjectWithTasks(this.idProject).subscribe((project: ProjectComplete) => {
        this.project.tasks = project.tasks;
      });
    });
  }

  openEditTask(task: TaskDto): void {
    const dialogEdit = this.dialog.open(EditTaskDialog, {
      width: '250px',
      data: task
    });

    dialogEdit.afterClosed().subscribe(() => {
      this.projectService.getProjectWithTasks(this.idProject).subscribe((project: ProjectComplete) => {
        this.project.tasks = project.tasks;
      });
    });
  }

  openEstimateTask(taskId: number): void {
    const dialogCreate = this.dialog.open(EstimateTaskDialog, {
      width: '250px',
      data: taskId
    });
    dialogCreate.afterClosed().subscribe((task: TaskSimple) => {
      this.projectService.getProjectWithTasks(this.idProject).subscribe((project: ProjectComplete) => {
        this.project.tasks = project.tasks;
      });
    });
  }

}

@Component({
  selector: 'estimate-task-dialog',
  templateUrl: 'estimate-task-dialog.html',
  styleUrls: ['./estimate-task-dialog.css']
})
export class EstimateTaskDialog implements OnInit {

  taskId: number;
  taskEstimate: TaskEstimate;
  points = new FormControl('', { validators: [Validators.pattern('^([1-9]){1}$|([0-9]{2,})$')] });

  constructor(
    public dialogRef: MatDialogRef<EstimateTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskId = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.taskEstimate = { points: this.points.value, task: this.taskId };
    this.taskService.estimateTask(this.taskEstimate).subscribe((task: TaskEstimate) => {
      this.dialogRef.close();
    });
  }

  getErrorMessageEstimate(): string {
    return this.points.hasError('pattern') ? 'Debe ser un número mayor que 0' : '';
  };

  validForm(): boolean {
    let valid: boolean;
    valid = this.points.valid;
    return valid;
  }
}

@Component({
  selector: 'bottom-sheet-select-sprint',
  templateUrl: 'bottom-sheet-select-sprint.html',
  styleUrls: ['./bottom-sheet-select-sprint.css']
})
export class SelectSprintBottomSheet implements OnInit {
  constructor(private bottomSheetRef: MatBottomSheetRef<SelectSprintBottomSheet>, private taskService: TaskService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private router: Router, private sprintService: SprintService,
    private _snackBar: MatSnackBar) { }

  sprints: SprintWorkspace[];
  taskId: number;
  taskMove: TaskMove;

  ngOnInit(): void {
    this.taskId = this.data.idTask;
    this.sprints = this.data.sprints;
  }

  moveTaskToSprint(idColumn: number, idTask: number, idSprint: number): void {
    this.sprintService.getSprint(idSprint).subscribe((sprint: SprintDisplay) => {
      let today: number = new Date().getTime();
      let endDate: number = new Date(sprint.endDate).getTime();
      if (endDate > today) {
        this.taskMove = { destiny: idColumn, task: idTask };
        this.taskService.moveTask(this.taskMove).subscribe(() => {
          this.bottomSheetRef.dismiss();
        });
      } else {
        this.openSnackBar("No puede asignar una tarea a un sprint finalizado.", "Cerrar");
      }
    }, (error) => {
      this.openSnackBar("Se ha producido un error. Intentelo de nuevo.", "Cerrar");
    });

  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

@Component({
  selector: 'new-task-dialog',
  templateUrl: 'new-task-dialog.html',
  styleUrls: ['./new-task-dialog.css']
})
export class NewTaskDialog implements OnInit {

  project: ProjectName;
  task: TaskSimple;
  title = new FormControl('', { validators: [Validators.required] });
  description = new FormControl('', { validators: [Validators.required] });
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NewTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectName,
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.project = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.validForm()) {
      this.loading = true;
      this.task = { title: this.title.value, description: this.description.value };
      this.taskService.createTask(this.project.id, this.task).subscribe((task: TaskSimple) => {
        this.dialogRef.close();
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
    }
  }

  getErrorMessageTitle(): string {
    return this.title.hasError('required') ? 'Este campo es obligatorio' : '';
  };

  getErrorMessageDescription(): string {
    return this.description.hasError('required') ? 'Este campo es obligatorio' : '';
  };

  validForm(): boolean {
    let valid: boolean;
    valid = this.title.valid && this.description.valid;
    return valid;
  }
}

@Component({
  selector: 'edit-task-dialog',
  templateUrl: 'edit-task-dialog.html',
  styleUrls: ['./edit-task-dialog.css']
})

export class EditTaskDialog implements OnInit {
  idTask: number;
  task: TaskSimple;
  title = new FormControl('', { validators: [Validators.required] });
  description = new FormControl('', { validators: [Validators.required] });
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskSimple,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.idTask = this.data.id;
    this.title.setValue(this.data.title);
    this.description.setValue(this.data.description);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.validForm()) {
      this.loading = true;
      this.task = { id: this.idTask, title: this.title.value, description: this.description.value };
      this.taskService.editTask(this.idTask, this.task).subscribe(() => {
        this.dialogRef.close();
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
    }
  }

  getErrorMessageTitle(): string {
    return this.title.hasError('required') ? 'Este campo es obligatorio' : '';
  };

  getErrorMessageDescription(): string {
    return this.description.hasError('required') ? 'Este campo es obligatorio' : '';
  };



  validForm(): boolean {
    let valid: boolean;
    valid = this.title.valid && this.description.valid;
    return valid;
  }
}
