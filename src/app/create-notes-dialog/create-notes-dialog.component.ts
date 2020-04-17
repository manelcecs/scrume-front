import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from '../servicio/note.service';

@Component({
  selector: 'app-create-notes-dialog',
  templateUrl: './create-notes-dialog.component.html',
  styleUrls: ['./create-notes-dialog.component.css']
})
export class CreateNotesDialogComponent implements OnInit {

  content: FormControl = new FormControl("", {
    validators: [Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<CreateNotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private noteServie: NoteService
  ) {}

  ngOnInit(): void {

  }

}
