import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Team } from '../dominio/team.domain';
import { ProjectDto, ProjectComplete } from '../dominio/project.domain';
import { ProjectService } from '../servicio/project.service';
import { TeamService } from '../servicio/team.service';
import { NewSprintDialog } from '../project/project.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../dominio/task.domain';
import { FormControl, Validators } from '@angular/forms';
import { TaskService } from '../servicio/task.service';


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
  description = new FormControl('',  { validators: [Validators.required]});
  estimate = new FormControl('',  { validators: [Validators.required]});
  // endDate = new FormControl('',  { validators: [Validators.required, this.validateToday] });

  constructor(
    public dialogRef: MatDialogRef<NewTaskDialog>,
    @Inject(MAT_DIALOG_DATA) newTask: Task,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    //this.project = this.data.project;
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

  // getErrorMessageStartDate() : String {
  //   return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':this.startDate.hasError('invalid')?'La fecha de fin no puede ser anterior a la de inicio':'';
  // };

  // getErrorMessageEndDate() : String {
  //   return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':'';
  // }

  // validForm():boolean {

  //   let valid: boolean;

  //   valid = this.endDate.valid && this.startDate.valid;
  //   return valid;

  // }

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

    //Validartor que compruebe si puede crear un sprnt en esas fechas con una query
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
