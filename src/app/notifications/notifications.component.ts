import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  InvitationDisplay,
  AnswerInvitation
} from "../dominio/invitation.domain";
import { InvitationService } from "../servicio/invitation.service";
import { AlertService } from '../servicio/alerts.service';
import { NotificationAlert } from '../dominio/notification.domain';
import { MyDailyFormComponent } from '../my-daily-form/my-daily-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../confirmation/confirmation.component';

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
    private alertService: AlertService,
    public dialog: MatDialog,
    public _snackbar: MatSnackBar
  ) { }

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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "250px",
      data: "Se va a rechazar la invitación. Esta acción es irreversible."
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.answerInvitation(invitation, false);
      }
    });

  }

  // Notifcations Alerts

  deleteNotification(alert: NotificationAlert) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "250px",
      data: "Se procede a borrar la notificación. Esta acción es irreversible."
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.alertService.deleteAlert(alert.id).subscribe(() => {
          this.onDiscardNotification.emit(null);
        }, (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.onDiscardNotification.emit(null);
            this._snackbar.open("El paquete mínimo del equipo no permite esta acción", "Cerrar", {
              duration: 5000
            })
          }

        });
      }
    });

  }

  openMyDailyDialog(alert: NotificationAlert, idSprint: number) {
    const dialogRef = this.dialog.open(MyDailyFormComponent, {
      width: "250px",
      data: { idSprint: idSprint },
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      this.daily = res;
      if (this.daily) {
        this.deleteNotification(alert);
      }
    });
  }

}
