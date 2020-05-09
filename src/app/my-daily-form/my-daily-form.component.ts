import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DocumentService } from "../servicio/document.service";
import { FormControl, Validators } from "@angular/forms";
import { Document, Daily, DailyComponent } from "../dominio/document.domain";
import { UserService } from "../servicio/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-my-daily-form",
  templateUrl: "./my-daily-form.component.html",
  styleUrls: ["./my-daily-form.component.css"],
})
export class MyDailyFormComponent implements OnInit {
  idSprint: number;
  nombre: string;

  done: FormControl = new FormControl("", {
    validators: [Validators.required],
  });
  doing: FormControl = new FormControl("", {
    validators: [Validators.required],
  });
  problems: FormControl = new FormControl("", {
    validators: [Validators.required],
  });

  documento: Document;

  daily: Daily;

  @ViewChild('submit') submitButton;

  constructor(
    public dialogRef: MatDialogRef<MyDailyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: DocumentService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.idSprint = this.data.idSprint;
    this.nombre = this.userService.getUserLogged().username.split("@")[0];

    //Cambiar a la nueva peticion
    this.documentService
      .getTodayDaily(this.idSprint)
      .subscribe((idDoc: number) => {
        this.documentService.getDocuments(idDoc).subscribe((doc: Document) => {
          if (doc != undefined) {
            this.documento = doc;
            if (
              !this.documento.content.startsWith("[") &&
              !this.documento.content.endsWith("]")
            ) {
              this.documento.content = "[" + this.documento.content + "]";
            }
          } else {
            let date = new Date();
            this.documento = {
              id: 0,
              name:
                "Daily " +
                date.getDay() +
                "/" +
                date.getMonth() +
                "/" +
                date.getFullYear(),
              sprint: this.idSprint,
              type: "DAILY",
              content: "[]",
            };
          }
        });
      });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSaveClick(): void {
    if (this.validForm()) {
      this.populateDaily();
      console.log(" el error " + JSON.parse(this.documento.content));
      let documentContent: DailyComponent = {
        daily: JSON.parse(this.documento.content),
      };
      documentContent.daily.push(this.daily);

      let content = JSON.stringify(documentContent);
      content = content.substring(
        content.indexOf(":") + 1,
        content.lastIndexOf("}")
      );
      this.documento.content = content;

      this.documentService.editDocument(this.documento).subscribe(
        () => {},
        (error) => {
          this.openSnackBar(
            "Ha ocurrido un error. Intentelo de nuevo.",
            "Cerrar",
            true
          );
        },
        () => {
          this.openSnackBar(
            "Tu daily se ha creado correctamente.",
            "Cerrar",
            false
          );
        }
      );
    }
  }

  validForm() {
    let valid: boolean = true;

    valid = valid && this.done.valid;
    valid = valid && this.doing.valid;
    valid = valid && this.problems.valid;

    if(valid)
      this.submitButton.focus();

    return valid;
  }

  populateDaily() {
    this.daily = {
      name: this.nombre,
      done: this.done.value,
      doing: this.doing.value,
      problems: this.problems.value,
    };
  }

  openSnackBar(message: string, action: string, error: boolean) {
    if (error) {
      this.snackBar.open(message, action, {
        duration: 2000,
      });
    } else {
      this.snackBar
        .open(message, action, {
          duration: 2000,
        })
        .afterDismissed()
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }
}
