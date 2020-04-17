import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NoteDisplay } from '../dominio/note.domain';
import { UserService } from '../servicio/user.service';
import { UserLogged } from '../dominio/jwt.domain';
import { NoteService } from '../servicio/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
holaMundo: string;
notes: NoteDisplay[];
user: UserLogged;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private noteService: NoteService) { }

  ngOnInit(): void {
   this.user = this.userService.getUserLogged();
   this.notes = [{
      content: 'Contenido',
      id: 3456,
      user : this.user
    }, {
      content: 'Contenido 2',
      id: 3457,
      user: this.user
    }];
  }

  createNote() {
    
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
