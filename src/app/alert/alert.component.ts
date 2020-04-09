import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationAlert } from '../dominio/notification.domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from '../servicio/alerts.service';
import { SprintService } from '../servicio/sprint.service';
import { SprintDisplay } from '../dominio/sprint.domain';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  idSprint: number;
  sprint: SprintDisplay;
  //alertas de sprint
  alertDate = new FormControl('');
  alertTitle = new FormControl('');

  alerts: NotificationAlert[] = [];

  constructor(public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number, 
    private alertService: AlertService, 
    private sprintService: SprintService) { }

  ngOnInit(): void {
   this.idSprint = this.data;
    this.sprintService.getSprint(this.idSprint).subscribe((sprintBD: SprintDisplay)=>{
      this.sprint = sprintBD;
    });
  }

  onSaveClick(): void{
    if(this.validForm()){
      for(let alert of this.alerts){
        this.alertService.crateAlert(alert).subscribe();
      }
      this.dialogRef.close();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  allowAdd(): boolean{
    let allow: boolean = true;

    //Están rellenos pero no requeridos
    allow = allow && this.alertTitle.value != "";
    allow = allow && this.alertDate.value != "";
    //Son válidos
    allow = allow && this.alertDate.valid;

    return allow;
  }

  beforeTodayDateValidator(date: FormControl){
    let formControlToTime : number = new Date(date.value).getTime();
    //Para controlar hoy hasta las 23:59
    formControlToTime = formControlToTime + 86340000;
    let todayToTime : number = new Date().getTime();
    if (formControlToTime < todayToTime) {
      date.setErrors({'beforeToday':true});
    } else {
      date.updateValueAndValidity();
    }
  }

  validDateInSprint(date: FormControl){
    let startDate = new Date(this.sprint.startDate).getTime();
    let endDate = new Date(this.sprint.endDate).getTime();

    let alertDate = new Date(date.value).getTime();
    //Para controlar hoy hasta las 23:59
    alertDate = alertDate + 86340000;

    if(startDate > alertDate){
      this.alertDate.setErrors({'betweenSprint': true});
    }else if(alertDate > endDate){
      this.alertDate.setErrors({'betweenSprint': true});
    }else{
      this.alertDate.updateValueAndValidity();
    }
  }

  getErrorMessageAlertDate(): string{
    return this.alertDate.hasError('beforeToday')? "La fecha seleccionada no puede ser anterior a la fecha actual" : 
    this.alertDate.hasError('betweenSprint')? "La fecha de la alerta debe estar dentro del Sprint": "";
  }

  //Alert Notificacion
  addAlert(): void{
    let alert: NotificationAlert;

    alert = {date: new Date(this.alertDate.value), sprint: this.idSprint, title: this.alertTitle.value};
    this.alerts.push(alert);

    this.alertDate.setValue('');
    this.alertTitle.setValue('');
  }

  remove(alert: NotificationAlert): void{
    let index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);

  }

  validForm(): boolean{
    return this.alerts.length > 0;
  }

}
