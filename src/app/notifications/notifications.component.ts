import { Component, OnInit } from "@angular/core";
import {
  InvitationDisplay,
  AnswerInvitation
} from "../dominio/invitation.domain";
import { InvitationService } from "../servicio/invitation.service";
import { timer } from "rxjs";
import { UserService } from '../servicio/user.service';
import { AlertService } from '../servicio/alerts.service';
import { NotificationAlert } from '../dominio/notification.domain';
import { MyDailyFormComponent } from '../my-daily-form/my-daily-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {
  invitations: InvitationDisplay[] = [];
  userSignedIn: number = 0;
  alerts: NotificationAlert[];
  date: string;
  daily: boolean = false;
  idSprint: number = 59;

  constructor(
    private invitationService: InvitationService,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    timer(0, 10000).subscribe(() => {
      if (sessionStorage.getItem("loginToken") != null && sessionStorage.getItem("loginToken") !== "") {

        this.invitationService
          .getInvitations()
          .subscribe((invitations: InvitationDisplay[]) => {
            this.invitations = invitations;
          });

        this.alertService.getAllAlertsByPrincipal().subscribe((alerts: NotificationAlert[]) => {
          this.alerts = alerts;
          let generalDate = new Date;
          let day = generalDate.getUTCDate();
          let month = generalDate.getUTCMonth()+1;
          let year = generalDate.getUTCFullYear();
          this.date = day + "/0" + month + "/" + year;
        });

      }
    });
  }

  answerInvitation(invitation: InvitationDisplay, answer: boolean) {
    let answeredInvitation: AnswerInvitation = {
      id: invitation.id,
      isAccepted: answer
    };
    this.invitationService
      .answerInvitation(invitation.id, answeredInvitation)
      .subscribe(() => {
        this.invitationService
          .getInvitations()
          .subscribe((invitations: InvitationDisplay[]) => {
            this.invitations = invitations;
          });
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
      console.log("se ha borrado correctamente");
    });
  }

   openMyDailyDialog() {
     const dialogRef = this.dialog.open(MyDailyFormComponent, {
       width: "250px",
       data: { idSprint: this.idSprint },
     });

     dialogRef.afterClosed().subscribe((res: boolean) => {
       this.daily = res;
     });
   }

}
