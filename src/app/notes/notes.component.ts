import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NoteDisplay } from '../dominio/note.domain';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
holaMundo: string;
notes: NoteDisplay[];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
   this.notes = [{
      id: 12,
      title: 'Nota personal',
      content: 'Contenido'
    }, {
      id: 15,
      title: 'Nota 2',
      content: 'Contenido 2'
    }];
    
  }

  drop(event: CdkDragDrop<{title: string, content: string}[]>) {
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
