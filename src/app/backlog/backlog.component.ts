import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Team, TeamSimple } from '../dominio/team.domain';
import { ProjectDto, ProjectComplete, ProjectName } from '../dominio/project.domain';
import { ProjectService } from '../servicio/project.service';
import { TeamService } from '../servicio/team.service';
import { NewSprintDialog } from '../project/project.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDto, TaskSimple, TaskBacklog, TaskMove } from '../dominio/task.domain';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { TaskService } from '../servicio/task.service';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import { Sprint, SprintDisplay, SprintWorkspace } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {

  idProject: number;
  project: ProjectComplete;
  sprints: SprintWorkspace[];
  searchValue;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private projectService: ProjectService, private teamService: TeamService,private dialog: MatDialog, 
    private taskService: TaskService, private bottomSheet: MatBottomSheet,
    private sprintService: SprintService) { 

      this.idProject = this.activatedRoute.snapshot.data.project.id;
      this.project = this.activatedRoute.snapshot.data.project;
      this.project.team = this.activatedRoute.snapshot.data.projectWithTeam.team;
      this.sprints = this.activatedRoute.snapshot.data.sprints;
    }

  ngOnInit(): void {
  }

  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  openProject(proj: ProjectComplete): void{
    this.router.navigate(['project'], {queryParams: {id: proj.id}});
  }

  openTeam(team: TeamSimple): void{
    this.router.navigate(['team'], {queryParams: {id: team.id}});
  }

  openSelectSprint(idTask: number): void {
    this.bottomSheet.open(SelectSprintBottomSheet,
      {
        data: {"idTask": idTask, "sprints": this.sprints}
      }
      ).afterDismissed().subscribe(() => {
        this.projectService.getProjectWithTasks(this.idProject).subscribe((project:ProjectComplete)=>{
          this.project.tasks = project.tasks;
        });
      });
  }

  deleteTask(task: TaskSimple): void{
    this.taskService.deleteTask(task.id).subscribe(()=>{
      this.projectService.getProjectWithTasks(this.idProject).subscribe((project:ProjectComplete)=>{
        this.project.tasks = project.tasks;
      });
    });
  }

  openCreateTask(): void {
    const dialogCreate = this.dialog.open(NewTaskDialog, {
      width: '250px',
      data: this.project
    });
    dialogCreate.afterClosed().subscribe((task: TaskSimple) => {
      this.projectService.getProjectWithTasks(this.idProject).subscribe((project:ProjectComplete)=>{
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
      this.projectService.getProjectWithTasks(this.idProject).subscribe((project:ProjectComplete)=>{
        this.project.tasks = project.tasks;
      });
    });
  }

}

@Component({
  selector: 'bottom-sheet-select-sprint',
  templateUrl: 'bottom-sheet-select-sprint.html',
  styleUrls: ['./bottom-sheet-select-sprint.css']
})
export class SelectSprintBottomSheet implements OnInit{
  constructor(private bottomSheetRef: MatBottomSheetRef<SelectSprintBottomSheet>, private taskService: TaskService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,  private router: Router, private sprintService:SprintService) {}

  sprints: SprintWorkspace[];
  taskId: number;
  taskMove: TaskMove;

  ngOnInit(): void {
      this.taskId = this.data.idTask;
      this.sprints = this.data.sprints;
  }

  moveTaskToSprint(idColumn: number, idTask:number): void{
    this.taskMove = {destiny: idColumn, task: idTask};
    this.taskService.moveTaskToSprint(this.taskMove).subscribe(()=>{
      this.bottomSheetRef.dismiss();
    });
  }

}

@Component({
  selector: 'new-task-dialog',
  templateUrl: 'new-task-dialog.html',
  styleUrls: ['./new-task-dialog.css']
})
export class NewTaskDialog implements OnInit{

  project: ProjectName;
  task: TaskSimple;
  title = new FormControl('',  { validators: [Validators.required]});
  description = new FormControl('',  { validators: []});
  points = new FormControl('',  { validators: [Validators.pattern('^([1-9]){1}$|([0-9]{2,})$')]});

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

  onSaveClick() : void {
    this.task = {title:this.title.value, description:this.description.value, points:this.points.value};
    this.taskService.createTask(this.project.id, this.task).subscribe((task: TaskSimple)=>{
      this.dialogRef.close();
    });
  }

  getErrorMessageTitle() : String {
    return this.title.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageDescription() : String {
    return this.description.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageEstimate() : String {
    return this.points.hasError('pattern')?'Debe ser un número mayor que 0':'';
  };

  validForm():boolean {
    let valid: boolean;
    valid = this.points.valid && this.title.valid && this.description.valid;
    return valid;
  }
}

@Component({
  selector: 'edit-task-dialog',
  templateUrl: 'edit-task-dialog.html',
  styleUrls: ['./edit-task-dialog.css']
})

export class EditTaskDialog implements OnInit{
  idTask: number;
  task: TaskSimple;
  title = new FormControl('',  { validators: [Validators.required]});
  description = new FormControl('',  { validators: []});
  points = new FormControl('',  { validators: [Validators.pattern('^([1-9]){1}$|([0-9]{2,})$')]});

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskSimple,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.idTask = this.data.id;
    this.title.setValue(this.data.title);
    this.description.setValue(this.data.description);
    this.points.setValue(this.data.points);
  }

  onNoClick(): void {
     this.dialogRef.close();
  }

  onSaveClick() : void {
    this.task = {id:this.idTask, title:this.title.value, description:this.description.value, points:this.points.value};
    this.taskService.editTask(this.idTask, this.task).subscribe(()=>{
      this.dialogRef.close();
    });
  }

  getErrorMessageTitle() : String {
    return this.title.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageDescription() : String {
    return this.description.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageEstimate() : String {
    return this.points.hasError('pattern')?'Debe ser un número mayor que 0':'';
  };

  validForm():boolean {
    let valid: boolean;
    valid = this.points.valid && this.title.valid && this.description.valid;
    return valid;
  }
}
