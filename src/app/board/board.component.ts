import { Component, OnInit } from '@angular/core';
import { ColumDto} from '../dominio/colum.domian';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardService } from '../servicio/board.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskDto, TaskMove } from '../dominio/task.domain';
import { BoardSimple, Board } from '../dominio/board.domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  board: Board;
  idBoard: number;
  task: TaskMove;

  constructor(private router: Router, private boardService: BoardService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

     this.activatedRoute.queryParams.subscribe(param => {

       if(param.id != undefined){
         //TODO
         this.idBoard = 171;

          this.boardService.getBoard(this.idBoard).subscribe((board:Board)=>{
             this.board = board;
          });

       }
     });

  }

  var: string = "To Do";

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {

      let col = new String(event.container.data);

      if (col == "To Do") {
        this.moveInArray(this.board.columns[0] , event.previousIndex , event.currentIndex);
      } else if (col == "Done"){
        this.moveInArray(this.board.columns[2] , event.previousIndex , event.currentIndex);
      } else {
        this.moveInArray(this.board.columns[1] , event.previousIndex , event.currentIndex);
      }
      
    } else {

      let col = new String(event.previousContainer.data);
      let col2 = new String(event.container.data);

      if (col == "To Do" && col2 == "In Progress") {
        this.transferTaskToArray(this.board.columns[0].tasks, this.board.columns[1].tasks, event.previousIndex, event.currentIndex);
      } else if (col == "To Do" && col2 == "Done"){
        this.transferTaskToArray(this.board.columns[0].tasks, this.board.columns[2].tasks, event.previousIndex, event.currentIndex);
      } else if (col == "In Progress" && col2 == "To Do"){
        this.transferTaskToArray(this.board.columns[1].tasks, this.board.columns[0].tasks, event.previousIndex, event.currentIndex);
      } else if (col == "In Progress" && col2 == "Done"){
        this.transferTaskToArray(this.board.columns[1].tasks, this.board.columns[2].tasks, event.previousIndex, event.currentIndex);
      } else if (col == "Done" && col2 == "To Do"){
        this.transferTaskToArray(this.board.columns[2].tasks, this.board.columns[0].tasks, event.previousIndex, event.currentIndex);
      }else{
        this.transferTaskToArray(this.board.columns[2].tasks, this.board.columns[1].tasks, event.previousIndex, event.currentIndex);
      }

    }
    console.log("Previous container " + event.container.data);
    console.log("Previous index " +event.previousIndex);
    console.log("container " + event.container.data);
    console.log("Current index " + event.currentIndex);
    console.log("Distanse " + JSON.stringify(event.distance));
    console.log("Pointer over container " + event.isPointerOverContainer);
    console.log("item " + event.item.data);
  }

  private transferTaskToArray(origen: TaskDto[], destiny: TaskDto[], preIndex: number, newIndex: number) {
    
    let save = origen[preIndex];
    origen.splice(preIndex, 1);
    destiny.splice(newIndex, 0, save);
    console.log("origen  " + origen)
    console.log("destino  " +destiny)
    

  }

  // private _moveTasks(idTask, idColumn, id):Observable<TaskMove>{
  //   this.task = {id: id, destiny: idColumn, task: idTask};
  //   return this.task

  // }

  private moveInArray(container: ColumDto, preIndex: number, newIndex: number) {

    let arrayTareas = container.tasks;
    let save = arrayTareas[preIndex];
    arrayTareas.splice(preIndex, 1);
    arrayTareas.splice(newIndex, 0, save);

  }

  connectColums(name: string) {
    let res: string;
    if (name == "To Do"){
        res = "[reviewList,doneList]"
    } else if (name == "Done"){
        res = "[reviewList,todoList]"
    }else{
        res = "[doneList,todoList]"
    }
 }

navigateTo(route: String): void{
  this.router.navigate([route]);
}

deleteBord(idBoard : number): void {
  this.boardService.deleteBoard(idBoard).subscribe((board : BoardSimple) => {
    this.navigateTo("sprint");
  });
}


}
