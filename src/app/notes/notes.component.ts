import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NoteDisplay } from '../dominio/note.domain';
import { UserService } from '../servicio/user.service';
import { NoteService } from '../servicio/note.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateNotesDialogComponent } from '../create-notes-dialog/create-notes-dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
notes: NoteDisplay[];
contenidoNota: string;


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private noteService: NoteService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
   this.noteService
   .listNotes()
   .subscribe((notes: NoteDisplay[]) => {
    this.notes = notes;
   });
  }


  getDelete(idNote: number) {
    this.noteService.deleteNote(idNote).subscribe((note: NoteDisplay) => {
      this.noteService
        .listNotes()
        .subscribe((notes: NoteDisplay[]) => {
          this.notes = notes;
        });
    })
  }

  openCreateNoteDialog(idNote: number): void {
    const dialogRef = this.dialog.open(CreateNotesDialogComponent, {
      width: "250px",
      data: idNote,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.noteService
        .listNotes()
        .subscribe((notes: NoteDisplay[]) => {
          this.notes = notes;
        });
    });
  }

  drop(event: CdkDragDrop<{content: string}[]>) {
    moveItemInArray(this.notes, event.previousIndex, event.currentIndex);
  }

  navigateTo(route: string, id: number, method?: string) {
    if(method != undefined) {
      this.router.navigate([route], {queryParams:{id: id}});
    } else {
      this.router.navigate([route], {queryParams:{id: id, method: method}});
    }
  }
}
