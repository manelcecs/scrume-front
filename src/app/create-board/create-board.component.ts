import { Component, OnInit } from '@angular/core';
import { BoardService } from '../servicio/board.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardSimple } from '../dominio/board.domain';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css']
})
export class CreateBoardComponent implements OnInit {

  constructor(private router: Router, private boardService: BoardService, private activatedRoute: ActivatedRoute) { }

  private id: number;
  board: BoardSimple;

  name: FormControl = new FormControl('',{validators: [Validators.required, Validators.maxLength(15)]});

  ngOnInit(): void {

    // this.activatedRoute.queryParams.subscribe(params => {

    //   if (params.id != undefined){
    //     this.id = params.id;

    //     this.boardService.getBoard(this.id).subscribe((board: BoardSimple)=>{
    //       this.board = board;
    //     });

    //       this.name.setValue(this.board.name);
    //     }

    // });

  }
}
