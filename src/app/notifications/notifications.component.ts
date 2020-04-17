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

  constructor(
    private invitationService: InvitationService,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public _snackbar: MatSnackBar
    ) {}

  ngOnInit(): void {
          let generalDate = new Date();
          console.log("la fecha de hoy " + generalDate.toISOString());
          for (let noti of this.alerts){
            let today = generalDate.toISOString().split('T')[0];
            let notiDay = new Date(noti.date).toISOString().split('T')[0];
            console.log(today + " y " +notiDay);
            noti.isDaily = today === notiDay;
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

  deleteNotification(idNoti: number){
    this.alertService.deleteAlert(idNoti).subscribe(() => {
      this.onAnswerInvitations.emit(null);
      console.log("se ha borrado correctamente");
    });
  }

   openMyDailyDialog(idNoti: number, idSprint: number) {
     const dialogRef = this.dialog.open(MyDailyFormComponent, {
       width: "250px",
       data: { idSprint: idSprint },
     });
     console.log("el id del sprint" + idSprint);

     dialogRef.afterClosed().subscribe((res: boolean) => {
       this.daily = res;
       if(this.daily){
         this.deleteNotification(idNoti);
       }
     });
   }

}
