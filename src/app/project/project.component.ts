import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../servicio/project.service';
import { ProjectDto } from '../dominio/project.domain';
import { SprintService } from '../servicio/sprint.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintDisplay } from '../dominio/sprint.domain';
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
      console.log(result)
    });
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
  startDate = new FormControl('',  { validators: [Validators.required, this.validateToday, this.validateStartBeforeEnd]});
  endDate = new FormControl('',  { validators: [Validators.required, this.validateToday] });

  constructor(
    public dialogRef: MatDialogRef<NewSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: newSprint) {}


  ngOnInit(): void {
    this.project = this.data.project;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() : void {


  }

  getErrorMessageStartDate() : String {
    return this.startDate.hasError('required')?'Este campo es obligatorio':
    this.startDate.hasError('past')?'La fecha no puede ser en pasado':
    this.startDate.hasError('invalid')?'La fecha de fin no puede ser anterior a la de inicio':'';
  };

  getErrorMessageEndDate() : String {
    return this.startDate.hasError('required')?'Este campo es obligatorio':
    this.startDate.hasError('past')?'La fecha no puede ser en pasado':'';
  }

  validForm():boolean {

    let valid: boolean;

    valid = this.endDate.valid && this.startDate.valid;
    return valid;

  }

  validateToday(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
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
