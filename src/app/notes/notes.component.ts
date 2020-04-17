import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NoteDisplay } from '../dominio/note.domain';
import { UserService } from '../servicio/user.service';
import { UserLogged } from '../dominio/jwt.domain';
import { NoteService } from '../servicio/note.service';
import { CreateNotesDialogComponent } from '../create-notes-dialog/create-notes-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
holaMundo: string;
notes: NoteDisplay[];
user: UserLogged;
dialog: MatDialog;
sinnotas: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private noteService: NoteService) { }

  ngOnInit(): void {
   this.user = this.userService.getUserLogged();
   this.noteService.listNotes().subscribe((notes: NoteDisplay[]) => {
    this.notes = notes;
    if (this.notes.length == 0) {
      this.sinnotas = "No hay notas";
    }
   });
  }

  getDelete(idNote: number) {
    this.noteService.deleteNote(idNote).subscribe((note: NoteDisplay) => {
      // TODO
    })
  }

  openCreateNoteDialog(): void {
    const dialogRef = this.dialog.open(CreateNotesDialogComponent, {
      width: "250px",
    });
    // TODO
    /*dialogRef.afterClosed().subscribe(() => {
      this.noteService
        .
        .subscribe((note: Document[]) => {
          this.doc = doc;
        });
    });*/
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
