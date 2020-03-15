import { Component, OnInit } from '@angular/core';
import { ColumDto} from '../dominio/colum.domian';
import { Router } from '@angular/router';
import { BoardService } from '../servicio/board.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskDto } from '../dominio/task.domain';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  colums: ColumDto [];

  constructor(private router: Router, private boardService: BoardService) { }

  ngOnInit(): void {
    sessionStorage.setItem("user", "Jonh Doe");
    sessionStorage.setItem("pass", "constrasenya");
    this.colums = this.boardService.getTaskForColums(); //añadir subscribe((colums:Colums)=>{this.colums = colums});
    
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    console.log("Previous container " + event.previousContainer.data);
    console.log("Previous index " +event.previousIndex);
    console.log("container " + event.container.data);
    console.log("Current index " + event.currentIndex);
    console.log("Distanse " + JSON.stringify(event.distance));
    console.log("Pointer over container " + event.isPointerOverContainer);
    console.log("item " + event.item.data);
  }

  private transferTaskToArray(origen: TaskDto[], destiny: TaskDto[], item: TaskDto, index: number) {
    
    let i: number = origen.indexOf(item);
    origen.splice(i, 1);
    destiny.splice(index, 0, item);

  }

}
