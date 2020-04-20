import { Component, OnInit } from '@angular/core';
import { ColumDto } from '../dominio/colum.domian';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardService } from '../servicio/board.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskDto, TaskMove } from '../dominio/task.domain';
import { Board } from '../dominio/board.domain';
import { TaskService } from '../servicio/task.service';
import { MatDialog } from '@angular/material/dialog';
import { AssingTaskDialog } from '../assing-task/assing-task.dialog.component';
import { SprintDisplay } from '../dominio/sprint.domain';
import { SprintService } from '../servicio/sprint.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  board: Board;
  idBoard: number;
  task: TaskMove;
  n: number;
  taskSend: TaskMove;
  idSprint: number;
  sprint: SprintDisplay;

  constructor(private router: Router, private boardService: BoardService, private activatedRoute: ActivatedRoute,
    private taskservice: TaskService, private dialog: MatDialog, private sprintService: SprintService) {
    this.board = this.activatedRoute.snapshot.data.board;

    this.sprint = this.activatedRoute.snapshot.data.sprint;

  }

  ngOnInit(): void {

    if (this.board != undefined) {
      this.idBoard = this.board.id;
      this.idSprint = this.sprint.id;
    } else {
      this.navigateTo("teams");
    }

  }

  var: string = "To Do";

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {

      let col = event.previousContainer.data + "";
      let col2 = event.container.data + "";

      if (col == "To do" && col2 == "In progress") {
        this.n = this.transferTaskToArray(this.board.columns[0].tasks, this.board.columns[1].tasks, event.previousIndex, event.currentIndex);
        this.moveTask(this.board.columns[1].id, this.n);
      } else if (col == "To do" && col2 == "Done") {
        this.n = this.transferTaskToArray(this.board.columns[0].tasks, this.board.columns[2].tasks, event.previousIndex, event.currentIndex);
        this.moveTask(this.board.columns[2].id, this.n);
      } else if (col == "In progress" && col2 == "To do") {
        this.n = this.transferTaskToArray(this.board.columns[1].tasks, this.board.columns[0].tasks, event.previousIndex, event.currentIndex);
        this.moveTask(this.board.columns[0].id, this.n);
      } else if (col == "In progress" && col2 == "Done") {
        this.n = this.transferTaskToArray(this.board.columns[1].tasks, this.board.columns[2].tasks, event.previousIndex, event.currentIndex);
        this.moveTask(this.board.columns[2].id, this.n);
      } else if (col == "Done" && col2 == "To do") {
        this.n = this.transferTaskToArray(this.board.columns[2].tasks, this.board.columns[0].tasks, event.previousIndex, event.currentIndex);
        this.moveTask(this.board.columns[0].id, this.n);
      } else {
        this.n = this.transferTaskToArray(this.board.columns[2].tasks, this.board.columns[1].tasks, event.previousIndex, event.currentIndex);
        this.moveTask(this.board.columns[1].id, this.n);
      }

    }
  }

  private transferTaskToArray(origen: TaskDto[], destiny: TaskDto[], preIndex: number, newIndex: number) {

    let save = origen[preIndex];
    origen.splice(preIndex, 1);
    destiny.splice(newIndex, 0, save);
    return save.id;

  }

  private moveInArray(container: ColumDto, preIndex: number, newIndex: number) {

    let arrayTareas = container.tasks;
    let save = arrayTareas[preIndex];
    arrayTareas.splice(preIndex, 1);
    arrayTareas.splice(newIndex, 0, save);

  }

  connectColums(name: string) {
    let res: string;
    if (name == "To Do") {
      res = "[reviewList,doneList]"
    } else if (name == "Done") {
      res = "[reviewList,todoList]"
    } else {
      res = "[doneList,todoList]"
    }
  }

  navigateTo(route: string, method?: string, id?: number): void{
    if(method==undefined && id == undefined){
      this.router.navigate([route]);
    }else if(method != undefined && id == undefined){
      this.router.navigate([route], {queryParams:{method: method}});
    }else if(method == undefined && id != undefined){
      this.router.navigate([route], {queryParams:{id: id}});
    }else if(method != undefined && id != undefined){
      this.router.navigate([route], {queryParams:{method: method, id: id}});
    }
  }

  openProject(proj: number): void {
    this.router.navigate(['project'], { queryParams: { method: "list", idProject: proj } });
  }

  moveTask(idDest: number, idtask: number): void {
    this.taskSend = { destiny: idDest, task: idtask };
    this.taskservice.moveTask(this.taskSend).subscribe(() => { });
  }

  onClick(event): any {
  }

  addUsers(task: TaskDto) {
    let dialog = this.dialog.open(AssingTaskDialog, {
      width: '250px',
      data: {
        idWorkspace: this.board.id,
        idTask: task.id,
        usersAsign: task.users
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.boardService.getBoard(this.idBoard).subscribe((board: Board) => {
        this.board = board;
      });

    });
  }

  back() {
    this.router.navigate(['sprint'], { queryParams: { method: "get", idSprint: this.idSprint } });
  }

}
