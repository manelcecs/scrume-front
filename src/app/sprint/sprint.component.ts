import { Component, OnInit, Inject } from "@angular/core";
import {
  Sprint,
  SprintDisplay,
  SprintJsonDates,
} from "../dominio/sprint.domain";
import {
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { SprintService } from "../servicio/sprint.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BoardSimple, BoardNumber, Board } from "../dominio/board.domain";
import { BoardService } from "../servicio/board.service";
import { Observable } from "rxjs";
import { Document, Daily } from "../dominio/document.domain";
import { DocumentService } from "../servicio/document.service";
import { AlertService } from "../servicio/alerts.service";
import { NotificationAlert } from "../dominio/notification.domain";
import { AlertComponent } from "../alert/alert.component";
import { MyDailyFormComponent } from "../my-daily-form/my-daily-form.component";
import { UserService } from "../servicio/user.service";

@Component({
  selector: "app-sprint",
  templateUrl: "./sprint.component.html",
  styleUrls: ["./sprint.component.css"],
})
export class SprintComponent implements OnInit {
  sprint: SprintDisplay;
  idSprint: number;
  board: BoardSimple[];
  boardDelete: BoardNumber;
  doc: Document[];
  document: Document;

  alerts: NotificationAlert[] = [];

  daily: boolean = false;

  constructor(
    private sprintService: SprintService,
    private boardService: BoardService,
    private documentService: DocumentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param) => {
      if (param.id != undefined) {
        this.idSprint = param.id;

        this.sprintService
          .getSprint(this.idSprint)
          .subscribe((sprintDisplay: SprintDisplay) => {
            this.sprint = sprintDisplay;
          });

        //lista de boards

        this.boardService
          .getBoardBySprint(this.idSprint)
          .subscribe((board: BoardSimple[]) => {
            this.board = board;
          });

        //lista de documents

        this.documentService
          .getDocumentsBySprint(this.idSprint)
          .subscribe((doc: Document[]) => {
            this.doc = doc;
          });

        this.compruebaDailyRellena();

        this.loadAlerts();
      } else {
        this.navigateTo("bienvenida");
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditSprintDialog, {
      width: "250px",
      data: this.sprint,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.sprintService
        .getSprint(this.idSprint)
        .subscribe((sprintDisplay: SprintDisplay) => {
          this.sprint = sprintDisplay;
        });
    });
  }

  openProject(proj: number): void {
    this.router.navigate(["project"], { queryParams: { id: proj } });
  }

  openTeam(team: number): void {
    this.router.navigate(["team"], { queryParams: { id: team } });
  }

  //Board-----------------------------------------------------------------------------------------------------------------------------------

  openBoard(board: number): void {
    this.router.navigate(["board"], {
      queryParams: { id: board, idSprint: this.idSprint },
    });
  }

  createBoard(row: SprintDisplay): void {
    this.router.navigate(["createBoard"], { queryParams: { id: row.id } });
  }

  editBoard(row: BoardNumber, sprint: SprintDisplay): void {
    this.router.navigate(["createBoard"], {
      queryParams: { idBoard: row.id, idSprint: sprint.id },
    });
  }

  deleteBoard(board: BoardNumber): void {
    this._deleteBoard(board.id).subscribe((board: BoardNumber) => {
      this.boardDelete = board;

      this.sprintService
        .getSprint(this.idSprint)
        .subscribe((sprintDisplay: SprintDisplay) => {
          this.sprint = sprintDisplay;
        });

      this.boardService
        .getBoardBySprint(this.idSprint)
        .subscribe((board: BoardSimple[]) => {
          this.board = board;
        });

      this.documentService
        .getDocumentsBySprint(this.idSprint)
        .subscribe((doc: Document[]) => {
          this.doc = doc;
        });
    });
  }

  private _deleteBoard(id: number): Observable<BoardNumber> {
    return this.boardService.deleteBoard(id);
  }

  //Document------------------------------------------------------------------------------------------------------------

  deleteDoc(id: number): void {
    this._deleteDoc(id).subscribe((doc: Document) => {
      this.document = doc;

      this.sprintService
        .getSprint(this.idSprint)
        .subscribe((sprintDisplay: SprintDisplay) => {
          this.sprint = sprintDisplay;
        });

      this.boardService
        .getBoardBySprint(this.idSprint)
        .subscribe((board: BoardSimple[]) => {
          this.board = board;
        });

      this.documentService
        .getDocumentsBySprint(this.idSprint)
        .subscribe((docSave: Document[]) => {
          this.doc = docSave;
        });
    });
  }

  private _deleteDoc(id: number): Observable<Document> {
    return this.documentService.deleteDocument(id);
  }

  openDialogDoc(sprint: SprintDisplay): void {
    const dialogRef = this.dialog.open(NewDocumentDialog, {
      width: "250px",
      data: sprint.id,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.documentService
        .getDocumentsBySprint(this.idSprint)
        .subscribe((doc: Document[]) => {
          this.doc = doc;
        });
    });
  }

  openDocument(doc: number): void {
    this.router.navigate(["document"], { queryParams: { id: doc } });
  }

  //---------- Alertas
  openAlertDialog(alertId: number): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: "250px",
      data: { idSprint: this.idSprint, idAlert: alertId },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadAlerts();
    });
  }

  deleteAlert(idAlert: number) {
    this.alertService.deleteAlert(idAlert).subscribe(() => {
      this.loadAlerts();
    });
  }

  loadAlerts() {
    this.alertService.getAllAlertsSprint(this.idSprint).subscribe(
      (alerts: NotificationAlert[]) => {
        this.alerts = alerts;
      },
      (error) => {
        console.error(error.error);
      }
    );
  }

  //--------- My Daily Form

  openMyDailyDialog() {
    const dialogRef = this.dialog.open(MyDailyFormComponent, {
      width: "250px",
      data: { idSprint: this.idSprint },
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      this.daily = res;
    });
  }

  compruebaDailyRellena() {
    this.documentService
      .getTodayDaily(this.idSprint)
      .subscribe((idDoc: number) => {
        if (idDoc != -1) {
          this.documentService
            .getDocuments(idDoc)
            .subscribe((doc: Document) => {
              if (doc != undefined) {
                // En caso que se produzca un error con las comillas simple doc.content = doc.content.replace(/'/g, '"');
                let dailyConts = JSON.parse(doc.content);

                let username = this.userService
                  .getUserLogged()
                  .username.split("@")[0];
                for (let cont of dailyConts) {
                  let dailyWrited: Daily = cont;
                  if (dailyWrited.name == username) {
                    this.daily = true;
                    break;
                  }
                }
              }else{
                this.daily = true;
              }
            });
        } else {
          this.daily = true;
        }
      });
  }
}

//Dialog de Crear Document--------------------------------------------------------------------------------

@Component({
  selector: "new-document-dialog",
  templateUrl: "new-document-dialog.html",
  styleUrls: ["./new-document-dialog.css"],
})
export class NewDocumentDialog implements OnInit {
  idSprint: number;

  document: Document;
  board: BoardSimple[];
  doc: Document[];

  tipos: string[];
  review: string;

  selected: string;
  cont: string;

  tipo = new FormControl("", { validators: [Validators.required] });

  constructor(
    public dialogRef: MatDialogRef<NewDocumentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private documentService: DocumentService,
    private boardService: BoardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idSprint = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(select: string): void {
    console.log(this.tipo);
    if (this.tipo.valid) {
      if (select == "REVIEW" || select == "MIDDLE_REVIEW") {
        let json = {
          done: "",
          noDone: "",
          rePlanning: "",
        };
        this.cont = JSON.stringify(json);
      } else if (select == "RETROSPECTIVE" || select == "MIDDLE_RETROSPECTIVE") {
        let json = {
          good: "",
          bad: "",
          improvement: "",
        };
        this.cont = JSON.stringify(json);
      } else if (select == "DAILY") {
        this.cont = "[ ]";
      }else {
        let json = {
          entrega: "",
          conseguir: "",
        };
        this.cont = JSON.stringify(json);
      }

      this.document = {
        id: 0,
        name: "Añade aquí el nombre",
        content: this.cont,
        sprint: this.idSprint,
        type: select,
      };

      this.documentService
        .createDocument(this.idSprint, this.document)
        .subscribe((doc: Document) => {
          this.document = doc;

          this.dialogRef.close();
        });
    }
  }

  getTipoErrorMessage(): string {
    return this.tipo.hasError("required") ? "Este campo es obligatorio" : "";
  }
}

//Dialog de Sprint-----------------------------------------------------------------------------------------

@Component({
  selector: "edit-sprint-dialog",
  templateUrl: "edit-sprint-dialog.html",
  styleUrls: ["./edit-sprint-dialog.css"],
})
export class EditSprintDialog implements OnInit {
  idSprint: number;
  sprint: SprintJsonDates;
  //FIXME: Arreglar los validators
  startDate = new FormControl("", { validators: [Validators.required] });
  endDate = new FormControl("", { validators: [Validators.required] });

  constructor(
    public dialogRef: MatDialogRef<EditSprintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: SprintDisplay,
    private sprintService: SprintService
  ) {}

  ngOnInit(): void {
    this.idSprint = this.data.id;
    this.startDate.setValue(new Date(this.data.startDate));
    this.endDate.setValue(new Date(this.data.endDate));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.sprint = {
      id: this.idSprint,
      startDate: new Date(this.startDate.value).toISOString(),
      endDate: new Date(this.endDate.value).toISOString(),
    };
    this.sprintService
      .editSprint(this.idSprint, this.sprint)
      .subscribe((sprint: Sprint) => {
        this.dialogRef.close();
      });
  }

  getErrorMessageStartDate(): string {
    return this.startDate.hasError("required")
      ? "Este campo es obligatorio"
      : this.startDate.hasError("past")
      ? "La fecha no puede ser en pasado"
      : this.startDate.hasError("invalid")
      ? "La fecha de fin no puede ser anterior a la de inicio"
      : this.startDate.hasError("usedDates")
      ? "Ya hay un sprint en las fechas seleccionadas"
      : this.startDate.hasError("beforeToday")
      ? "La fecha no puede ser anterior a hoy"
      : "";
  }

  getErrorMessageEndDate(): string {
    return this.endDate.hasError("required")
      ? "Este campo es obligatorio"
      : this.endDate.hasError("past")
      ? "La fecha no puede ser en pasado"
      : this.endDate.hasError("usedDates")
      ? "Ya hay un sprint en las fechas seleccionadas"
      : this.endDate.hasError("beforeTodayEnd")
      ? "La fecha no puede ser anterior a hoy"
      : "";
  }

  validForm(): boolean {
    let valid: boolean;
    valid = this.endDate.valid && this.startDate.valid;
    return valid;
  }

  afterTodayStarDateValidator() {
    let formControlToTime: number = new Date(this.startDate.value).getTime();
    let todayToTime: number = new Date().getTime();
    console.log("Validator de hoy:", formControlToTime);
    if (formControlToTime < todayToTime) {
      this.startDate.setErrors({ beforeToday: true });
    } else {
      this.startDate.updateValueAndValidity();
    }
    console.log("ERrores start", this.startDate.errors);
  }

  afterTodayEndDateValidator() {
    let formControlToTime: number = new Date(this.endDate.value).getTime();
    let todayToTime: number = new Date().getTime();
    console.log("Validator de hoy:", formControlToTime);
    if (formControlToTime < todayToTime) {
      this.endDate.setErrors({ beforeTodayEnd: true });
    } else {
      this.endDate.updateValueAndValidity();
    }
    console.log("Errores end", this.endDate.errors);
  }

  validDatesValidator() {
    console.log("Validator de dates");
    this.sprintService
      .checkDates(
        this.data.project.id,
        this.startDate.value,
        this.endDate.value
      )
      .subscribe((res: boolean) => {
        console.log("Res:", res);
        if (!res) {
          this.startDate.setErrors({ usedDates: true });
          this.endDate.setErrors({ usedDates: true });
        } else if (
          !(
            this.startDate.hasError("beforeToday") ||
            this.endDate.hasError("beforeTodayEnd")
          )
        ) {
          this.startDate.updateValueAndValidity();
          this.endDate.updateValueAndValidity();
        }
        console.log("Errors 1:", this.startDate.errors);
      });
  }
}
