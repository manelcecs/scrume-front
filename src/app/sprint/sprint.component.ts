import { Component, OnInit, Inject } from '@angular/core';
import { Sprint, SprintDisplay } from '../dominio/sprint.domain';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewSprintDialog } from '../project/project.component';
import { SprintService } from '../servicio/sprint.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

  sprint : SprintDisplay;
  idSprint : number;

  constructor(private sprintService : SprintService, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {

      if(param.id != undefined){
        this.idSprint = param.id;

        this.sprint = this.sprintService.getSprint(this.idSprint);

      } else{
        this.navigateTo("bienvenida");
      }
    }
    )}

  navigateTo(route: String): void{
    this.router.navigate([route]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditSprintDialog, {
      width: '250px',
      data: this.sprint
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}


@Component({
  selector: 'edit-sprint-dialog',
  templateUrl: 'edit-sprint-dialog.html',
  styleUrls: ['./edit-sprint-dialog.css']
})
export class EditSprintDialog implements OnInit{

  idSprint: number;
  sprint : Sprint;
  startDate = new FormControl('',  { validators: [Validators.required, this.validateToday, this.validateStartBeforeEnd]});
  endDate = new FormControl('',  { validators: [Validators.required, this.validateToday] });

  constructor(
    public dialogRef: MatDialogRef<EditSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: SprintDisplay,
    private sprintService: SprintService) {}


  ngOnInit(): void {
    this.idSprint = this.data.id;
    this.startDate.setValue(this.data.starDate);
    this.endDate.setValue(this.data.endDate);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() : void {
    this.sprint = {id:0, starDate:this.startDate.value, endDate:this.endDate.value}
    this.sprintService.editSprint(this.idSprint, this.sprint);
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
