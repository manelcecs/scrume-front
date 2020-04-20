import { Component, OnInit } from '@angular/core';
import { BoardService } from '../servicio/board.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Board, BoardNumber } from '../dominio/board.domain';
import { Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css']
})
export class CreateBoardComponent implements OnInit {

  constructor(private router: Router, private boardService: BoardService, private activatedRoute: ActivatedRoute) { }

  private idSprint: number;
  private idBoard: number;
  board: Board;
  boardCreate: BoardNumber;
  boardEdit: BoardNumber;

  name: FormControl = new FormControl('',{validators: [Validators.required, Validators.maxLength(15)]});

  ngOnInit(): void {

     this.activatedRoute.queryParams.subscribe(params => {

       if (params.id != undefined){

        this.idSprint = params.id;

      }else{

        this.idBoard = params.idBoard;
        this.idSprint = params.idSprint;

        this.boardService.getBoard(this.idBoard).subscribe((board: Board)=>{
          this.board = board;

          this.name.setValue(this.board.name);

        });


      }

     });

  }

  validForm():boolean {

    let valid: boolean = true;

    valid = valid && this.name.valid;
    return valid;

  }

  createBoard(): void {

    if (this.validForm()){


      if (this.idBoard != undefined){

        this._editBoard().subscribe((resp: BoardNumber) => {

          this.boardEdit = resp;
        }, (error)=>{

        }, ()=>{
          this.router.navigate(["sprint"], { queryParams: { method:"get", idSprint: this.idSprint } });
        });

      }else{

        this._createBoard().subscribe((resp: BoardNumber) => {

          this.boardCreate = resp;
          
        }, (error)=>{

        }, ()=>{
          this.router.navigate(["sprint"], { queryParams: { method:"get", idSprint: this.idSprint } });
        });

      }


    }
  }

  private _editBoard(): Observable<BoardNumber>{
    this.boardEdit  = {id:this.idBoard, name: this.name.value, sprint: this.idSprint};
    return this.boardService.editBoard(this.boardEdit);

   }

  private _createBoard(): Observable<BoardNumber>{
    this.boardCreate = {id:0, name: this.name.value, sprint: this.idSprint};
    return this.boardService.createBoard(this.boardCreate);
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  cancelCreateBoard(): void {
    this.router.navigate(["sprint"], { queryParams: { method:"get", idSprint: this.idSprint } });
  }

  getErrorMessageName(): String {
    return this.name.hasError('required')?'Este campo es requerido.':this.name.hasError('maxlength')?'Este campo no permite más de 15 caracteres.':'';

  }

}
