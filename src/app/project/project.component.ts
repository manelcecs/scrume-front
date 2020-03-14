import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../servicio/project.service';
import { ProjectDto } from '../dominio/project.domain';
import { SprintService } from '../servicio/sprint.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintDisplay, Sprint } from '../dominio/sprint.domain';
import { FormControl, Validators, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css', './new-sprint-dialog.css']
})
export class ProjectComponent implements OnInit {
  project : ProjectDto;
  sprints : SprintDisplay[];
  startDate: Date;
  endDate: Date;

  constructor(
     private router: Router,
     private projectService: ProjectService,
     private sprintService : SprintService,
     public dialog: MatDialog
    ) { }

  ngOnInit(): void {
     this.project = this.projectService.getProject(0);
     this.sprints = this.sprintService.getSprintsOfProject(0);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(NewSprintDialog, {
      width: '250px',
      data: {project:this.project.id,startDate: this.startDate, endDate: this.endDate}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  navigateToSprint(sprint : Sprint) : void {
    this.router.navigate(["sprint"], {queryParams: {id : sprint.id}});
  }

  editProject(project : ProjectDto){
    this.router.navigate(['project/create'], {queryParams: {id: project.id, action:"edit"}});
  }

  deleteProject(idProject : number) {
    this.projectService.deleteProject(idProject);
  }
}


// DIALOGO PARA CREAR UN SPRINT

export interface newSprint {
  project: number,
  startDate: Date,
  endDate: Date,
}

@Component({
  selector: 'new-sprint-dialog',
  templateUrl: 'new-sprint-dialog.html',
  styleUrls: ['./new-sprint-dialog.css']
})
export class NewSprintDialog implements OnInit{

  project: number;
  sprint: Sprint;
  startDate = new FormControl('',  { validators: [Validators.required, this.validateToday, this.validateStartBeforeEnd]});
  endDate = new FormControl('',  { validators: [Validators.required, this.validateToday] });

  constructor(
    public dialogRef: MatDialogRef<NewSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: newSprint,
    private sprintService: SprintService) {}


  ngOnInit(): void {
    this.project = this.data.project;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() : void {
    this.sprint = {id:0, starDate:this.startDate.value, endDate:this.endDate.value, proyecto:this.project}
    this.sprintService.createSprint(this.sprint);
    console.log(this.sprint);
    this.dialogRef.close();

  }

  getErrorMessageStartDate() : String {
    return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':this.startDate.hasError('invalid')?'La fecha de fin no puede ser anterior a la de inicio':'';
  };

  getErrorMessageEndDate() : String {
    return this.startDate.hasError('required')?'Este campo es obligatorio':this.startDate.hasError('past')?'La fecha no puede ser en pasado':'';
  }

  validForm():boolean {

    let valid: boolean;

    valid = this.endDate.valid && this.startDate.valid;
    return valid;

  }

  validateToday(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      console.log("Prueba 2")
      let isValid = true;

      if (control.value.getTime() < Date.now()) {
        isValid = false;
      }
      return isValid ? null : { 'past': 'the date cant be past' }
    };
  }

  validateStartBeforeEnd(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let isValid = true;
      if (control.value.getTime() > this.endDate.value.getTime()) {
        isValid = false;
      }
      return isValid ? null : { 'invalid': 'Invalid dates' }

    };
  }

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
