import { Component, OnInit } from '@angular/core';
import { BoardService } from '../servicio/board.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardSimple, Board, BoardNumber } from '../dominio/board.domain';
import { Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css']
})
export class CreateBoardComponent implements OnInit {

  constructor(private router: Router, private boardService: BoardService, private activatedRoute: ActivatedRoute) { }

  private id: number;
  board: Board;
  boardCreate: BoardNumber;

  name: FormControl = new FormControl('',{validators: [Validators.required, Validators.maxLength(15)]});

  ngOnInit(): void {

     this.activatedRoute.queryParams.subscribe(params => {

       if (params.id != undefined){
         this.id = params.id;

         this.boardService.getBoard(this.id).subscribe((board: Board)=>{
           this.board = board;
         });

          this.name.setValue(this.board.name);
         }

     });

  }

  validForm():boolean {

    let valid: boolean = true;

    valid = valid && this.name.valid;
    return valid;

  }

  createBoard(): void {

    if (this.id != undefined){

      // this._editBoard(this.id).subscribe((resp: Board) => {

      //   this.board = resp;
      //   this.navigateTo("teams");
      // });

    }else{

      this._createBoard().subscribe((resp: BoardNumber) => {

        this.boardCreate = resp;
        this.navigateTo("createBoard");
      });

    }


  }

  // private _editBoard(id: number):Observable<Board>{
  //   this.board.name = this.name.value;
  //   this.board.id = id;
  //   return this.boardService.editBoard(this.board);

  // }

  private _createBoard():Observable<BoardNumber>{
    console.log("name" + name)
    console.log("sprint" + this.id)
    this.boardCreate = {id:0, name: this.name.value, sprint: this.id}
    return this.boardService.createBoard(this.boardCreate);
  }

  navigateTo(route: string): void{
    this.router.navigate([route]);
  }

  cancelCreateBoard(): void {

    this.router.navigate(['sprint']);

  }

  getErrorMessageName(): String {
    return this.name.hasError('required')?'Este campo es requerido.':this.name.hasError('maxlength')?'Este campo no permite más de 15 caracteres.':'';

  }

}
