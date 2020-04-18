import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  InvitationDisplay,
  AnswerInvitation
} from "../dominio/invitation.domain";
import { InvitationService } from "../servicio/invitation.service";
import { UserService } from '../servicio/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {


  @Input() invitations: InvitationDisplay[] = [];
  @Output() onAnswerInvitations: EventEmitter<any> = new EventEmitter();
  userSignedIn: number = 0;

  constructor(private invitationService: InvitationService,private userService: UserService, public _snackbar: MatSnackBar) {}

  ngOnInit(): void {

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
}
