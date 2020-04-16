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
  daily: boolean = false;
  idSprint: number = 59;

  constructor(
    private invitationService: InvitationService,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public _snackbar: MatSnackBar
    ) {}

  ngOnInit(): void {
          let generalDate = new Date;
          let day = generalDate.getUTCDate();
          let month = generalDate.getUTCMonth()+1;
          let year = generalDate.getUTCFullYear();
          this.date = day + "/0" + month + "/" + year;
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

   openMyDailyDialog(idNoti: number) {
     const dialogRef = this.dialog.open(MyDailyFormComponent, {
       width: "250px",
       data: { idSprint: this.idSprint },
     });
     console.log("el id del sprint" + this.idSprint);

     dialogRef.afterClosed().subscribe((res: boolean) => {
       this.daily = res;
       //Aqui creo que meter el delete en un futuro
       //this.deleteNotification(idNoti);
     });
   }

}
