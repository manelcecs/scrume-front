import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Team } from '../dominio/team.domain';
import { ProjectDto, ProjectComplete } from '../dominio/project.domain';
import { ProjectService } from '../servicio/project.service';
import { TeamService } from '../servicio/team.service';
import { NewSprintDialog } from '../project/project.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../dominio/task.domain';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { TaskService } from '../servicio/task.service';
import { isNumber } from 'util';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {

  idProject: number;
  team: Team;
  project: ProjectComplete;
  searchValue;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private projectService: ProjectService, private teamService: TeamService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {

      if(param.id != undefined){
        this.idProject = param.id;

        this.teamService.getTeamByProjectID(this.idProject).subscribe((team:Team)=>{

          this.team = team;
          
          this.projectService.getProjectWithTasks(this.idProject).subscribe((project:ProjectComplete)=>{
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

  openCreateTask(): void {
    const dialogRef = this.dialog.open(NewTaskDialog, {
      width: '250px',
      data: {project:this.project.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openEditTask(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialog, {
      width: '250px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'new-task-dialog',
  templateUrl: 'new-task-dialog.html',
  styleUrls: ['./new-task-dialog.css']
})
export class NewTaskDialog implements OnInit{

  project: number;
  task: Task;
  name = new FormControl('',  { validators: [Validators.required]});
  description = new FormControl('',  { validators: []});
  estimate = new FormControl('',  { validators: [this.validateNumberOptional(), this.validatePositiveOptional()]});

  constructor(
    public dialogRef: MatDialogRef<NewTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
     this.dialogRef.close();
  }

  onSaveClick() : void {
    this.task = {id:0, name:this.name.value, description:this.description.value, estimate:this.estimate.value}
    this.taskService.createTask(this.task);
    console.log(this.task);
    this.dialogRef.close();
  }

  getErrorMessageName() : String {
    return this.name.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageDescription() : String {
    return this.description.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageEstimate() : String {
    return this.estimate.hasError('number')?'Debe ser un número':this.estimate.hasError('negative')?'Debe ser mayor o igual a 0':'';
  };

  validForm():boolean {

    let valid: boolean;

    valid = this.estimate.valid && this.name.valid && this.description.valid;
    return valid;

  }

  validateNumberOptional(): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} | null => {
       let isValid = true;
       if (control.value !== '' && !isNumber(this.estimate)) {
         isValid = false;
       }
       return isValid ? null : { 'number': 'the estimate must be a number' }
     };
  }

  validatePositiveOptional(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
     let isValid = true;

     if (control.value !== '' && control.value < 0) {
       isValid = false;
     }
     return isValid ? null : { 'negative': 'the estimate must be a number' }
   };
}
}

@Component({
  selector: 'edit-task-dialog',
  templateUrl: 'edit-task-dialog.html',
  styleUrls: ['./edit-task-dialog.css']
})
export class EditTaskDialog implements OnInit{
  idTask: number;
  task: Task;
  name = new FormControl('',  { validators: [Validators.required]});
  description = new FormControl('',  { validators: []});
  estimate = new FormControl('',  { validators: [this.validateNumberOptional(), this.validatePositiveOptional()]});

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.idTask = this.data.id;
    this.name.setValue(this.data.name);
    this.description.setValue(this.data.description);
    this.estimate.setValue(this.data.estimate);
  }

  onNoClick(): void {
     this.dialogRef.close();
  }

  onSaveClick() : void {
    this.task = {id:0, name:this.name.value, description:this.description.value, estimate:this.estimate.value}
    this.taskService.editTask(this.idTask, this.task);
    console.log(this.task);
    this.dialogRef.close();
  }

  getErrorMessageName() : String {
    return this.name.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageDescription() : String {
    return this.description.hasError('required')?'Este campo es obligatorio':'';
  };

  getErrorMessageEstimate() : String {
    return this.estimate.hasError('number')?'Debe ser un número':this.estimate.hasError('negative')?'Debe ser mayor o igual a 0':'';
  };

  validForm():boolean {

    let valid: boolean;

    valid = this.estimate.valid && this.name.valid && this.description.valid;
    return valid;

  }

  validateNumberOptional(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
     let isValid = true;
     console.log("ndfndndnvdvnnvd " + control.value);
     if(control.value != undefined){
      console.log("Hola " + control.value);
      if (isNumber(this.estimate)) { //FIXME DEJA PASAR NUMEROS, LETRAS Y HASTA A BORJA IGLESIAS
        isValid = false;
      }
     }
     return isValid ? null : { 'number': 'the estimate must be a number' }
   };
  }

  validatePositiveOptional(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
    let isValid = true;

    if (control.value !== '' && control.value < 0) {
      isValid = false;
    }
    return isValid ? null : { 'negative': 'the estimate must be a number' }
  };
}
}
