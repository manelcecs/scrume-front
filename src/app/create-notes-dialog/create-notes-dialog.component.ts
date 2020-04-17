import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from '../servicio/note.service';
import { NoteDisplay } from '../dominio/note.domain';
import { UserService } from '../servicio/user.service';
import { NotesComponent } from '../notes/notes.component';
import { UserLogged } from '../dominio/jwt.domain';

@Component({
  selector: 'app-create-notes-dialog',
  templateUrl: './create-notes-dialog.component.html',
  styleUrls: ['./create-notes-dialog.component.css']
})
export class CreateNotesDialogComponent implements OnInit {
  content: string;
  idNote: number;

  validator: FormControl = new FormControl("", {
    validators: [Validators.required],
  });

  note: NoteDisplay;

  constructor(
    public dialogRef: MatDialogRef<CreateNotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDisplay,
    private snackBar: MatSnackBar,
    private noteService: NoteService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.idNote = this.data.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validForm() {
    let valid: boolean = true;
    valid = valid && this.validator.valid;
    return valid;
  }

  createJSON() {
    this.note = {
      id: 0,
      content: this.content,
      user: this.userService.getUserLogged()
    }
  }

  onSaveClick(): void {
    if (this.validForm()) {
      if (this.idNote != undefined) {
        this.noteService.updateNote(this.idNote, this.content).subscribe(() => {},
          (error) => {
            this.openSnackBar(
              "Ha ocurrido un error. Inténtelo de nuevo.",
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
      } else {
      this.createJSON();
      this.noteService.createNote(this.content).subscribe(() => {},
      (error) => {
        this.openSnackBar(
          "Ha ocurrido un error. Inténtelo de nuevo.",
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
  }

  


