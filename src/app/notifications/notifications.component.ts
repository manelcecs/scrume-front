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

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {
  invitations: InvitationDisplay[] = [];
  userSignedIn: number = 0;
  alerts: NotificationAlert[];

  constructor(private invitationService: InvitationService,private userService: UserService, private alertService: AlertService) {}

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
}
