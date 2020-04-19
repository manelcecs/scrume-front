import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  InvitationDisplay,
  AnswerInvitation
} from "../dominio/invitation.domain";
import { InvitationService } from "../servicio/invitation.service";
import { UserService } from '../servicio/user.service';
import { AlertService } from '../servicio/alerts.service';
import { NotificationAlert } from '../dominio/notification.domain';
import { MyDailyFormComponent } from '../my-daily-form/my-daily-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {


  @Input() invitations: InvitationDisplay[] = [];
  @Input() alerts: NotificationAlert[] = [];
  @Output() onAnswerInvitations: EventEmitter<any> = new EventEmitter();
  @Output() onDiscardNotification: EventEmitter<any> = new EventEmitter();
  userSignedIn: number = 0;
  date: string;
  daily: boolean;
  alertas: NotificationAlert[];

  constructor(
    private invitationService: InvitationService,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public _snackbar: MatSnackBar
    ) {}

  ngOnInit(): void {
      if (sessionStorage.getItem("loginToken") != null && sessionStorage.getItem("loginToken") !== "") {
        let generalDate = new Date();
        this.alertService.getAllAlertsByPrincipal().subscribe((alerts : NotificationAlert[]) => {
          this.alertas = alerts;
          for (let noti of this.alertas){
            let today = generalDate.toISOString().split('T')[0];
            let notiDay = new Date(noti.date).toISOString().split('T')[0];
            noti.isDaily = today === notiDay;
          }
        });
      }
          
  }

  answerInvitation(invitation: InvitationDisplay, answer: boolean) {
    let answeredInvitation: AnswerInvitation = {
      id: invitation.id,
      isAccepted: answer
    };
    this.invitationService
      .answerInvitation(invitation.id, answeredInvitation)
      .subscribe(() => {
        this.onAnswerInvitations.emit(null);
      });
  }

  acceptInvitation(invitation: InvitationDisplay) {
    this.answerInvitation(invitation, true);
  }

  rejectInvitation(invitation: InvitationDisplay) {
    this.answerInvitation(invitation, false);
  }

  // Notifcations Alerts

  deleteNotification(alert: NotificationAlert){
    this.alertService.deleteAlert(alert.id).subscribe(() => {
      this.onAnswerInvitations.emit(null);
      console.log("se ha borrado correctamente");
      let index = this.alertas.indexOf(alert);
      this.alertas.splice(index, 1);
    });
  }

   openMyDailyDialog(alert: NotificationAlert, idSprint: number) {
     const dialogRef = this.dialog.open(MyDailyFormComponent, {
       width: "250px",
       data: { idSprint: idSprint },
     });

     dialogRef.afterClosed().subscribe((res: boolean) => {
       this.daily = res;
       if(this.daily){
         this.deleteNotification(alert);
       }
     });
   }

}
