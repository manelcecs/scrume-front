import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from '../servicio/note.service';
import { NoteDisplay } from '../dominio/note.domain';
import { UserService } from '../servicio/user.service';

@Component({
  selector: 'app-create-notes-dialog',
  templateUrl: './create-notes-dialog.component.html',
  styleUrls: ['./create-notes-dialog.component.css']
})
export class CreateNotesDialogComponent implements OnInit {
  idNote: number;

  content: FormControl = new FormControl("", {
    validators: [Validators.required],
  });

  note: NoteDisplay;

  @ViewChild('submit') submitButton;

  constructor(
    public dialogRef: MatDialogRef<CreateNotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private snackBar: MatSnackBar,
    private noteService: NoteService,
    private userService: UserService
  ) {  }

  ngOnInit(): void {
    this.idNote = this.data;
    if (this.idNote > 0) {
      this.noteService.getNote(this.idNote).subscribe((note: NoteDisplay) => {
        this.note = note;
        this.content.setValue(this.note.content);
      })
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validForm() {
    let valid: boolean = true;
    valid = valid && this.content.valid;
    if(valid)
      this.submitButton.focus();
    return valid;
  }

  onSaveClick(): void {
    if (this.validForm()) {
      if (this.idNote > 0) {
        this.note = { content: this.content.value };
        this.noteService.updateNote(this.note, this.idNote).subscribe(() => {},
          (error) => {
            this.openSnackBar(
              "Ha ocurrido un error. Inténtelo de nuevo.",
              "Cerrar",
              true
            );
          },
          () => {
            this.openSnackBar(
              "Tu nota se ha actualizado correctamente.",
              "Cerrar",
              false
            );
          }
        );
      } else {
      this.note = {content: this.content.value};
      this.noteService.createNote(this.note).subscribe(() => {},
      (error) => {
        this.openSnackBar(
          "Ha ocurrido un error. Inténtelo de nuevo.",
          "Cerrar",
          true
        );
      },
      () => {
        this.openSnackBar(
          "Tu nota se ha creado correctamente.",
          "Cerrar",
          false
        );
      }
      );
    }
  }
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
            this.dialogRef.close();
          });
      }
    }

  getErrorMessageName(): string {
    return this.content.hasError('required') ? 'Este campo es requerido.' :'';
    }
  }

  


